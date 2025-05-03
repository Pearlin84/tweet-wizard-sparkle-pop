
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
    
    // Apply user limits
    count = enforceUserLimits(userType, count);
    
    if (count === 0) {
      throw new Error("Tweet generation limit reached");
    }
    
    console.log(`Requesting ${count} ${tone} tweets about "${topic}" from Edge Function`);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-tweets', {
      body: { topic, count, tone }
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
      recordUserUsage(user.id, count);
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
        `${topic} is up 35% in 2025! How will this shape your strategy? Share insights! #${topic.replace(/\s+/g, '')} #BusinessTrends`,
        `Why is ${topic} critical for 2025? New report reveals key drivers. Check it out: [link] #${topic.replace(/\s+/g, '')} #IndustryInsights`,
        `Top 3 ${topic} trends for 2025: 1) Innovation 2) Efficiency 3) Scale. Which matters most to you? #${topic.replace(/\s+/g, '')} #ProTips`,
        `Experts predict ${topic} will transform markets by 2026. Agree or overhyped? #${topic.replace(/\s+/g, '')} #FutureOfBusiness`,
        `Just dropped: ${topic} guide for professionals. Boost your ROI with these tips! #${topic.replace(/\s+/g, '')} #CareerGrowth [link]`
      ];
      break;
    
    case "casual":
      defaultFormats = [
        `Yo, ${topic} is blowing up in 2025! 🔥 What's your fave part about it? #${topic.replace(/\s+/g, '')} #JustVibing`,
        `Obsessed with ${topic} lately! Anyone else? Drop your thoughts below! 👇 #${topic.replace(/\s+/g, '')} #ChatTime`,
        `Just tried a new ${topic} trick and it's 🤯! Wanna know more? DM me! #${topic.replace(/\s+/g, '')} #LifeHacks`,
        `What's the deal with ${topic}? Spill your tips or hacks! 💯 #${topic.replace(/\s+/g, '')} #CommunityVibes`,
        `${topic} is my new jam! What's the best resource to dive deeper? #${topic.replace(/\s+/g, '')} #LearnWithMe`
      ];
      break;
      
    case "humorous":
      defaultFormats = [
        `Me: I'll master ${topic} in a day. Reality: Googling it at 2 AM like 😵 What's your ${topic} fail? #${topic.replace(/\s+/g, '')} #LOL`,
        `${topic} experts be like: "It's simple!" Me: *staring at 47 tabs* 🙃 Thoughts? #${topic.replace(/\s+/g, '')} #Relatable`,
        `Tried ${topic} and now I'm basically a pro… or a disaster. 🤔 Which is it? #${topic.replace(/\s+/g, '')} #SendHelp`,
        `If ${topic} was a movie, it'd be a comedy of errors. What's your funniest ${topic} moment? #${topic.replace(/\s+/g, '')} #Humor`,
        `${topic} at 9 AM: Easy. ${topic} at midnight: Why do I exist? 😅 Share your story! #${topic.replace(/\s+/g, '')} #LateNightStruggles`
      ];
      break;
      
    case "inspirational":
      defaultFormats = [
        `Your ${topic} journey starts with one step in 2025. What's yours? Keep going! ✨ #${topic.replace(/\s+/g, '')} #Motivation`,
        `Dream big with ${topic}! Every challenge is a chance to grow. What's your next move? #${topic.replace(/\s+/g, '')} #Inspire`,
        `${topic} isn't just a skill—it's your path to impact. Start today! 🌟 #${topic.replace(/\s+/g, '')} #2025Goals`,
        `The future of ${topic} is yours to shape. What's one goal you're chasing? #${topic.replace(/\s+/g, '')} #DreamBig`,
        `Small wins in ${topic} lead to big breakthroughs. What's your win today? 🏆 #${topic.replace(/\s+/g, '')} #KeepPushing`
      ];
      break;
      
    case "informative":
      defaultFormats = [
        `Did you know? ${topic} grew 42% in 2024! Here's why it matters: [link] #${topic.replace(/\s+/g, '')} #Facts`,
        `3 key ${topic} stats for 2025: 1) Growth 2) Adoption 3) Impact. Which surprises you? #${topic.replace(/\s+/g, '')} #Data`,
        `How ${topic} works: A quick breakdown for beginners. Check it out: [link] #${topic.replace(/\s+/g, '')} #Learn`,
        `Recent study on ${topic} shows 70% efficiency gains. Thoughts? #${topic.replace(/\s+/g, '')} #Research`,
        `${topic} 101: 5 facts to know for 2025. What's new to you? #${topic.replace(/\s+/g, '')} #Knowledge [chart]`
      ];
      break;
    
    case "controversial":
      defaultFormats = [
        `Unpopular opinion: ${topic} is overhyped in 2025. Change my mind! 👀 #${topic.replace(/\s+/g, '')} #HotTake`,
        `Is ${topic} saving or ruining the industry? Let's argue! 🔥 #${topic.replace(/\s+/g, '')} #Debate`,
        `Why ${topic} might fail by 2026. Agree or disagree? Drop your take! #${topic.replace(/\s+/g, '')} #Controversy`,
        `The dark side of ${topic} nobody talks about. What's your view? #${topic.replace(/\s+/g, '')} #RealTalk`,
        `${topic} is divisive—love it or hate it? Spill the tea! ☕ #${topic.replace(/\s+/g, '')} #BoldOpinions`
      ];
      break;
      
    default:
      defaultFormats = [
        `What's new with ${topic} in 2025? Here's the latest scoop! [link] #${topic.replace(/\s+/g, '')} #Trends`,
        `Just discovered ${topic}! What's one tip you'd share? 💡 #${topic.replace(/\s+/g, '')} #LearnTogether`,
        `Why is ${topic} trending? Let's unpack it! Share your thoughts. #${topic.replace(/\s+/g, '')} #WhatsHot`,
        `Top ${topic} hack for 2025: [Quick tip]. Got a better one? #${topic.replace(/\s+/g, '')} #Tips`,
        `${topic} is changing fast! What's the future look like? 🔮 #${topic.replace(/\s+/g, '')} #FutureTrends`
      ];
  }
  
  // Generate the requested number of tweets (limited by our default formats)
  for (let i = 0; i < Math.min(count, defaultFormats.length); i++) {
    tweets.push(defaultFormats[i]);
  }
  
  // If user requested more tweets than we have formats, duplicate with slight variations
  if (count > defaultFormats.length) {
    for (let i = defaultFormats.length; i < count; i++) {
      const baseIndex = i % defaultFormats.length;
      
      // Create more unique variations by swapping words or adding emojis
      const baseTweet = defaultFormats[baseIndex];
      let newTweet = baseTweet;
      
      // Add variation to make it more unique
      const variations = [
        { from: 'Check it out', to: 'See more' },
        { from: 'Here\'s', to: 'Here is' },
        { from: 'Amazing', to: 'Incredible' },
        { from: '!', to: '!!' },
        { from: 'What\'s', to: 'What is' },
        { from: 'Thoughts?', to: 'What do you think?' }
      ];
      
      // Apply a random variation
      const variation = variations[Math.floor(Math.random() * variations.length)];
      newTweet = newTweet.replace(variation.from, variation.to);
      
      // Add a random emoji if not already present
      if (!newTweet.includes('😀')) {
        const emojis = ['✨', '🚀', '💡', '🔥', '👏', '💪', '🙌', '👍', '🌟', '💯'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        newTweet = newTweet.replace('[link]', `[link] ${randomEmoji}`);
      }
      
      // Ensure tweet is within character limit
      if (newTweet.length > 280) {
        newTweet = newTweet.substring(0, 277) + '...';
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
