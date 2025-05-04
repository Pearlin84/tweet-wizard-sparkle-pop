
import { supabase } from "../integrations/supabase/client";
import { TweetData, GenerationOptions } from "../types/tweet";

// User segmentation limits
const USER_LIMITS = {
  guest: {
    tweetsPerGeneration: 2,
    generationsAllowed: 2,
    totalLimit: 4
  },
  free: {
    tweetsPerDay: 5,
    tweetsPerMonth: 150
  },
  basic: {
    tweetsPerDay: 30
  },
  pro: {
    tweetsPerDay: 100
  }
};

export const generateTweets = async (topic: string, count: number, tone: string = "professional"): Promise<string[]> => {
  try {
    // Check user type and limits
    const { data: { user } } = await supabase.auth.getUser();
    const userType = getUserType(user);
    
    // Apply user limits - enforces the correct number of tweets based on user role
    const allowedCount = enforceUserLimits(userType, count);
    
    if (allowedCount === 0) {
      throw new Error("Tweet generation limit reached");
    }
    
    console.log(`Requesting ${allowedCount} ${tone} tweets about "${topic}" from Edge Function`);
    
    // Call the Supabase Edge Function with the allowed count
    const { data, error } = await supabase.functions.invoke('generate-tweets', {
      body: { topic, count: allowedCount, tone }
    });
    
    if (error) {
      console.error("Supabase Edge Function error:", error);
      throw new Error(`Error calling generate-tweets function: ${error.message}`);
    }
    
    if (!data || !data.tweets || !Array.isArray(data.tweets)) {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format from tweet generation service");
    }
    
    // Record usage for authenticated users
    if (user) {
      recordUserUsage(user.id, data.tweets.length);
    }
    
    console.log(`Successfully received ${data.tweets.length} tweets from Edge Function`);
    return data.tweets;
  } catch (error) {
    console.error("Error generating tweets:", error);
    // Fallback to mock implementation if the edge function fails
    return generateMockTweets(topic, count, tone);
  }
};

// Determine user type based on authentication and subscription status
const getUserType = (user: any): 'guest' | 'free' | 'basic' | 'pro' => {
  if (!user) return 'guest';
  
  // Check subscription status - this would come from your subscription management system
  // This is a placeholder - implement actual subscription check based on your system
  const subscription = localStorage.getItem(`subscription_${user.id}`);
  
  if (subscription === 'pro') return 'pro';
  if (subscription === 'basic') return 'basic';
  return 'free';
};

// Enforce usage limits based on user type
const enforceUserLimits = (userType: 'guest' | 'free' | 'basic' | 'pro', requestedCount: number): number => {
  if (userType === 'guest') {
    // For guests, check localStorage to track usage
    const guestUsage = JSON.parse(localStorage.getItem('guest_usage') || '{"generations": 0, "tweets": 0}');
    
    if (guestUsage.generations >= USER_LIMITS.guest.generationsAllowed) {
      return 0; // Limit reached
    }
    
    // Update guest usage
    guestUsage.generations += 1;
    guestUsage.tweets += requestedCount;
    localStorage.setItem('guest_usage', JSON.stringify(guestUsage));
    
    // Enforce tweet count limit for guests
    return Math.min(requestedCount, USER_LIMITS.guest.tweetsPerGeneration);
  }
  
  if (userType === 'free') {
    // Check daily and monthly usage from localStorage (in real app, use database)
    const today = new Date().toISOString().split('T')[0];
    const month = today.substring(0, 7); // YYYY-MM format
    
    const dailyUsage = parseInt(localStorage.getItem(`tweets_daily_${today}`) || '0');
    const monthlyUsage = parseInt(localStorage.getItem(`tweets_monthly_${month}`) || '0');
    
    if (dailyUsage >= USER_LIMITS.free.tweetsPerDay || monthlyUsage >= USER_LIMITS.free.tweetsPerMonth) {
      return 0; // Limit reached
    }
    
    // Calculate remaining allowed tweets
    const dailyRemaining = USER_LIMITS.free.tweetsPerDay - dailyUsage;
    const monthlyRemaining = USER_LIMITS.free.tweetsPerMonth - monthlyUsage;
    const remaining = Math.min(dailyRemaining, monthlyRemaining);
    
    return Math.min(requestedCount, remaining);
  }
  
  if (userType === 'basic') {
    const today = new Date().toISOString().split('T')[0];
    const dailyUsage = parseInt(localStorage.getItem(`tweets_daily_${today}`) || '0');
    
    if (dailyUsage >= USER_LIMITS.basic.tweetsPerDay) {
      return 0; // Limit reached
    }
    
    return Math.min(requestedCount, USER_LIMITS.basic.tweetsPerDay - dailyUsage);
  }
  
  if (userType === 'pro') {
    const today = new Date().toISOString().split('T')[0];
    const dailyUsage = parseInt(localStorage.getItem(`tweets_daily_${today}`) || '0');
    
    if (dailyUsage >= USER_LIMITS.pro.tweetsPerDay) {
      return 0; // Limit reached
    }
    
    return Math.min(requestedCount, USER_LIMITS.pro.tweetsPerDay - dailyUsage);
  }
  
  return requestedCount;
};

// Record user usage (in localStorage for now, in real app use database)
const recordUserUsage = (userId: string, count: number) => {
  const today = new Date().toISOString().split('T')[0];
  const month = today.substring(0, 7); // YYYY-MM format
  
  // Update daily usage
  const dailyKey = `tweets_daily_${today}`;
  const currentDailyUsage = parseInt(localStorage.getItem(dailyKey) || '0');
  localStorage.setItem(dailyKey, (currentDailyUsage + count).toString());
  
  // Update monthly usage
  const monthlyKey = `tweets_monthly_${month}`;
  const currentMonthlyUsage = parseInt(localStorage.getItem(monthlyKey) || '0');
  localStorage.setItem(monthlyKey, (currentMonthlyUsage + count).toString());
};

// Mock tweet generation as fallback
const generateMockTweets = (topic: string, count: number, tone: string = "professional"): string[] => {
  // Mock a loading time
  console.log("Using mock tweet generator with tone:", tone);
  
  // Build the mock prompt response using the template
  const tweets = [];
  let defaultFormats: string[] = [];
  
  switch (tone.toLowerCase()) {
    case "professional":
      defaultFormats = [
        `${topic} is transforming industries in 2025! What's your strategy? #${topic.replace(/\s+/g, '')} #IndustryTrends #BusinessGrowth`,
        `New insights reveal ${topic} will be key in Q3 2025. Are you prepared? #${topic.replace(/\s+/g, '')} #MarketInsight #StrategicPlanning`,
        `3 ways ${topic} is disrupting traditional business models: innovation, scalability, and sustainability. Join the conversation! #${topic.replace(/\s+/g, '')} #Innovation #DisruptiveStrategy`,
        `Latest research shows ${topic} adoption increasing 47% YoY. How is your organization leveraging this trend? #${topic.replace(/\s+/g, '')} #DataDriven #GrowthStrategy`,
        `Exclusive webinar: Maximizing ROI with ${topic} implementation strategies. Save your spot! #${topic.replace(/\s+/g, '')} #ROIMaximizer #ExpertInsights`,
      ];
      break;
    
    case "casual":
      defaultFormats = [
        `OMG ${topic} is totally my new obsession! 🤩 Anyone else spending way too much time on this? #${topic.replace(/\s+/g, '')} #NewFave #CantGetEnough`,
        `Just discovered this amazing ${topic} hack that saved me hours! 🙌 Life-changing stuff! #${topic.replace(/\s+/g, '')} #GameChanger #LifeHack`,
        `weekend vibes = me + ${topic} + coffee ☕️ What's your perfect combo? #${topic.replace(/\s+/g, '')} #WeekendMood #SimpleJoys`,
        `That feeling when ${topic} just makes your day better 💯 Who else can relate? Drop a comment! #${topic.replace(/\s+/g, '')} #GoodVibesOnly #ShareYourStory`,
        `Anyone else staying up way too late exploring ${topic}? 😴 Worth it though! #${topic.replace(/\s+/g, '')} #NightOwl #WorthIt`,
      ];
      break;
      
    case "humorous":
      defaultFormats = [
        `I tried mastering ${topic} yesterday. Today my search history is "how to recover from ${topic} embarrassment" 🙃 #${topic.replace(/\s+/g, '')} #EpicFail #LessonLearned`,
        `${topic} experts be like "it's simple!" Meanwhile, I'm over here with 37 browser tabs open and questioning my life choices 😂 #${topic.replace(/\s+/g, '')} #TooManyTabs #SendHelp`,
        `My relationship status with ${topic}: "It's complicated" 🤪 Anyone else in this chaotic situationship? #${topic.replace(/\s+/g, '')} #ItsComplicated #RelationshipStatus`,
        `Pro tip: Never try ${topic} while eating spicy food. Don't ask how I know this information. 🔥🧯 #${topic.replace(/\s+/g, '')} #LearnFromMyMistakes #SpicyFail`,
        `My brain at 3am: "Remember that embarrassing thing with ${topic} from 7 years ago?" Thanks, brain. Super helpful. 😑 #${topic.replace(/\s+/g, '')} #BrainWhy #InsomniaThoughts`,
      ];
      break;
      
    case "inspirational":
      defaultFormats = [
        `Your journey with ${topic} doesn't have to be perfect—it just needs to be authentic. Start where you are. Use what you have. Do what you can. ✨ #${topic.replace(/\s+/g, '')} #YourJourney #StartToday`,
        `The challenges you face with ${topic} today are developing the strength you need for tomorrow. Keep pushing forward! 💪 #${topic.replace(/\s+/g, '')} #GrowthMindset #Perseverance`,
        `Don't wait for the perfect moment with ${topic}—take the moment and make it perfect. Your future self will thank you. ⏱️ #${topic.replace(/\s+/g, '')} #MakeItHappen #NoRegrets`,
        `In a world of algorithms and automation, your unique approach to ${topic} is your superpower. Embrace what makes you different. 🌟 #${topic.replace(/\s+/g, '')} #EmbraceUnique #YourSuperpower`,
        `The smallest step toward ${topic} mastery is still moving forward. Celebrate your progress, no matter how small. 🎯 #${topic.replace(/\s+/g, '')} #CelebrateProgress #SmallWins`,
      ];
      break;
      
    case "informative":
      defaultFormats = [
        `FACT: ${topic} adoption has increased by 72% among industry leaders in 2025. Key drivers: efficiency gains and competitive advantage. #${topic.replace(/\s+/g, '')} #DataInsights #IndustryTrends`,
        `NEW STUDY: ${topic} implementation reduces operational costs by an average of 31% within the first quarter. Full analysis in thread. #${topic.replace(/\s+/g, '')} #ROIStudy #BusinessEfficiency`,
        `5 critical ${topic} metrics every professional should track: 1) Engagement 2) Conversion 3) Retention 4) Scalability 5) Integration efficiency. Which do you prioritize? #${topic.replace(/\s+/g, '')} #MetricsMatters #DataDriven`,
        `The evolution of ${topic}: From niche concept to mainstream necessity. Timeline analysis shows 300% growth since 2023. #${topic.replace(/\s+/g, '')} #TechEvolution #GrowthAnalysis`,
        `Just released: Comprehensive guide to ${topic} integration with existing systems. Free download in bio. #${topic.replace(/\s+/g, '')} #IntegrationGuide #ExpertResource`,
      ];
      break;
    
    case "controversial":
      defaultFormats = [
        `Hot take: ${topic} is severely overrated in today's market. Change my mind. #${topic.replace(/\s+/g, '')} #UnpopularOpinion #DebateTime`,
        `The inconvenient truth about ${topic} that industry leaders don't want you to know. Thread 🧵 #${topic.replace(/\s+/g, '')} #TruthBomb #IndustrySecrets`,
        `Unpopular opinion: ${topic} will be obsolete by 2027. The signs are already here if you're paying attention. #${topic.replace(/\s+/g, '')} #FutureInsight #DisruptionAlert`,
        `I said what I said: ${topic} creates more problems than it solves. Who else sees through the hype? #${topic.replace(/\s+/g, '')} #BeyondTheHype #RealTalk`,
        `The ${topic} experiment has failed. Time to admit it and move on to more effective solutions. Thoughts? #${topic.replace(/\s+/g, '')} #HardTruths #NextGenSolutions`,
      ];
      break;
      
    default:
      defaultFormats = [
        `${topic} is trending for all the right reasons! Have you explored its potential yet? #${topic.replace(/\s+/g, '')} #TrendAlert #ExploreMore`,
        `Curious about ${topic}? Here's what you need to know before diving in. #${topic.replace(/\s+/g, '')} #BeginnerTips #StartHere`,
        `The ${topic} community is growing fast! Join the conversation and connect with fellow enthusiasts. #${topic.replace(/\s+/g, '')} #CommunityGrowth #JoinUs`,
        `What's your biggest challenge with ${topic}? Share below and let's solve it together! #${topic.replace(/\s+/g, '')} #ProblemSolving #CommunitySupport`,
        `Discovered an amazing ${topic} resource that's been a game-changer! Link in bio. #${topic.replace(/\s+/g, '')} #MustHave #ResourceShare`,
      ];
  }
  
  // Generate the requested number of tweets (limited by our default formats)
  for (let i = 0; i < Math.min(count, defaultFormats.length); i++) {
    tweets.push(defaultFormats[i]);
  }
  
  // If user requested more tweets than we have formats, create more unique variations
  if (count > defaultFormats.length) {
    for (let i = defaultFormats.length; i < count; i++) {
      const baseIndex = i % defaultFormats.length;
      
      // Create a more unique variation
      const baseTweet = defaultFormats[baseIndex];
      let newTweet = baseTweet;
      
      // Add variation to make it more unique and engaging
      const variations = [
        { from: 'Check it out', to: 'Must see this' },
        { from: 'Here\'s', to: 'Just discovered' },
        { from: 'Amazing', to: 'Mind-blowing' },
        { from: '!', to: '!! 🔥' },
        { from: 'What\'s', to: 'What is' },
        { from: 'Thoughts?', to: 'What\'s your take?' }
      ];
      
      // Apply a random variation
      const variation = variations[Math.floor(Math.random() * variations.length)];
      newTweet = newTweet.replace(variation.from, variation.to);
      
      // Add a random engaging emoji if not already present
      if (!newTweet.includes('😀')) {
        const emojis = ['✨', '🚀', '💡', '🔥', '👏', '💪', '🙌', '👍', '🌟', '💯'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        newTweet = newTweet.replace('[link]', `[link] ${randomEmoji}`);
      }
      
      // Ensure tweet is within character limit and has hashtags
      if (newTweet.length > 280) {
        newTweet = newTweet.substring(0, 277) + '...';
      }
      
      // Make sure there are at least two hashtags
      if ((newTweet.match(/#/g) || []).length < 2) {
        newTweet += ` #${topic.replace(/\s+/g, '')}Insights`;
      }
      
      tweets.push(newTweet);
    }
  }
  
  return tweets;
};

// Get user segment info for UI
export const getUserSegmentInfo = async (): Promise<{
  type: 'guest' | 'free' | 'basic' | 'pro',
  usageInfo: {
    used: number,
    limit: number,
    percentage: number
  },
  upgradeMessage?: string
}> => {
  // Check current auth status
  const { data: { user } } = await supabase.auth.getUser();
  const userType = getUserType(user);
  
  let used = 0;
  let limit = 0;
  let upgradeMessage = '';
  
  if (userType === 'guest') {
    const guestUsage = JSON.parse(localStorage.getItem('guest_usage') || '{"generations": 0, "tweets": 0}');
    used = guestUsage.tweets;
    limit = USER_LIMITS.guest.totalLimit;
    upgradeMessage = 'Sign up for free to generate more tweets!';
  } else if (userType === 'free') {
    const today = new Date().toISOString().split('T')[0];
    const dailyUsage = parseInt(localStorage.getItem(`tweets_daily_${today}`) || '0');
    used = dailyUsage;
    limit = USER_LIMITS.free.tweetsPerDay;
    upgradeMessage = 'Upgrade to Basic ($5/mo) for 6x more tweets per day!';
  } else if (userType === 'basic') {
    const today = new Date().toISOString().split('T')[0];
    const dailyUsage = parseInt(localStorage.getItem(`tweets_daily_${today}`) || '0');
    used = dailyUsage;
    limit = USER_LIMITS.basic.tweetsPerDay;
    upgradeMessage = 'Upgrade to Pro ($20/mo) for advanced features!';
  } else if (userType === 'pro') {
    const today = new Date().toISOString().split('T')[0];
    const dailyUsage = parseInt(localStorage.getItem(`tweets_daily_${today}`) || '0');
    used = dailyUsage;
    limit = USER_LIMITS.pro.tweetsPerDay;
  }
  
  const percentage = Math.min(Math.floor((used / limit) * 100), 100);
  
  return {
    type: userType,
    usageInfo: {
      used,
      limit,
      percentage
    },
    upgradeMessage: userType !== 'pro' ? upgradeMessage : undefined
  };
};
