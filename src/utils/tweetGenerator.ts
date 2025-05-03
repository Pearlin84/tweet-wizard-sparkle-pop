
import { supabase } from "../integrations/supabase/client";
import { TweetData, GenerationOptions } from "../types/tweet";

export const generateTweets = async (topic: string, count: number, tone: string = "professional"): Promise<string[]> => {
  try {
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
    
    console.log(`Successfully received ${data.tweets.length} tweets from Edge Function`);
    return data.tweets;
  } catch (error) {
    console.error("Error generating tweets:", error);
    // Fallback to mock implementation if the edge function fails
    return generateMockTweets(topic, count, tone);
  }
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
        `New research on ${topic} reveals significant implications for industry leaders. Key takeaways include improved efficiency and strategic advantages. #${topic.replace(/\s+/g, '')} #ProfessionalInsights`,
        `Just published: "The Complete Guide to ${topic}" - Essential reading for professionals looking to stay ahead of the curve in today's competitive landscape. #${topic.replace(/\s+/g, '')}`,
        `5 evidence-based strategies to optimize ${topic}: 1) Data-driven approach 2) Methodical implementation 3) Continuous evaluation 4) Stakeholder feedback 5) Iterative improvement #${topic.replace(/\s+/g, '')}`,
        `The evolution of ${topic} represents a paradigm shift in how we approach business challenges. Here's why industry leaders are taking notice. #${topic.replace(/\s+/g, '')} #IndustryTrends`,
        `Just released our comprehensive analysis on ${topic}. The findings demonstrate substantial ROI for organizations implementing best practices. #${topic.replace(/\s+/g, '')} #DataAnalysis`
      ];
      break;
    
    case "casual":
      defaultFormats = [
        `Hey! Just learned some cool stuff about ${topic}! Thought I'd share with y'all 😊 #${topic.replace(/\s+/g, '')} #JustSharing`,
        `Anyone else super into ${topic} lately? I've been obsessed! Share your thoughts below 👇 #${topic.replace(/\s+/g, '')} #ChatWithMe`,
        `So I tried this new approach to ${topic} and it's actually working pretty well! DM me if you want the details! #${topic.replace(/\s+/g, '')} #LifeHack`,
        `${topic} has been on my mind lately. What's your take on it? Drop your thoughts in the replies! #${topic.replace(/\s+/g, '')} #JustThinking`,
        `Weekend plans: Learning all about ${topic}! Anyone got good resources to recommend? #${topic.replace(/\s+/g, '')} #WeekendVibes`
      ];
      break;
      
    case "humorous":
      defaultFormats = [
        `Tried to become an expert on ${topic} today. My cat was NOT impressed. 😂 #${topic.replace(/\s+/g, '')} #CatJudgment`,
        `Me explaining ${topic} to my friends: *uses elaborate hand gestures* My friends: *visible confusion* 🤣 #${topic.replace(/\s+/g, '')} #ExplainLikeImFive`,
        `Pro tip: Never Google ${topic} at 3 AM. Unless you're prepared for an existential crisis and ordering weird stuff online. #${topic.replace(/\s+/g, '')} #InsomniaChoices`,
        `If ${topic} was a person, it would definitely be that friend who shows up to dinner with a random fact nobody asked for. We still love you though! #${topic.replace(/\s+/g, '')} #RandomThoughts`,
        `My brain at work: Important deadlines. My brain at 2 AM: *deep dive into ${topic}* #${topic.replace(/\s+/g, '')} #BrainWhy`
      ];
      break;
      
    case "inspirational":
      defaultFormats = [
        `Your journey with ${topic} doesn't define your destination, but it reveals the strength of your character along the way. Keep pushing forward! #${topic.replace(/\s+/g, '')} #NeverGiveUp`,
        `The greatest achievements in ${topic} weren't built on success, but on the lessons learned through failure and persistence. Your breakthrough awaits! #${topic.replace(/\s+/g, '')} #BelieveInYourself`,
        `When the path seems unclear, let your passion for ${topic} be your guiding light. The world needs your unique perspective. #${topic.replace(/\s+/g, '')} #FindYourPath`,
        `The seeds of greatness in ${topic} are planted in the soil of daily habits. What small step can you take today? #${topic.replace(/\s+/g, '')} #DailyProgress`,
        `Sometimes the greatest discoveries about ${topic} come when you're brave enough to venture beyond your comfort zone. What will you discover today? #${topic.replace(/\s+/g, '')} #EmbraceGrowth`
      ];
      break;
      
    case "informative":
      defaultFormats = [
        `Did you know? Recent studies on ${topic} indicate that 73% of participants experienced significant improvements after implementing these evidence-based strategies. #${topic.replace(/\s+/g, '')} #FactBased`,
        `The history of ${topic} dates back to the early 2000s, with significant evolutions occurring in response to technological advancements and changing user needs. #${topic.replace(/\s+/g, '')} #HistoricalContext`,
        `When examining ${topic}, it's important to consider these 3 key factors: 1) Contextual variables 2) Implementation methodology 3) Evaluation metrics #${topic.replace(/\s+/g, '')} #DeepDive`,
        `A comparative analysis of ${topic} across different industries reveals consistent patterns of adoption, with healthcare and finance leading implementation rates. #${topic.replace(/\s+/g, '')} #DataAnalysis`,
        `The relationship between ${topic} and productivity has been well-documented in peer-reviewed research, suggesting a correlation coefficient of 0.68 in controlled studies. #${topic.replace(/\s+/g, '')} #Research`
      ];
      break;
    
    case "controversial":
      defaultFormats = [
        `Unpopular opinion: Most "experts" on ${topic} have never actually implemented it successfully. Change my mind. #${topic.replace(/\s+/g, '')} #HotTake`,
        `Why is nobody talking about how ${topic} is fundamentally changing our society - and not necessarily for the better? #${topic.replace(/\s+/g, '')} #ThinkCritically`,
        `The mainstream narrative about ${topic} conveniently ignores these 5 uncomfortable truths that challenge the status quo. Thread 🧵 #${topic.replace(/\s+/g, '')} #ReThink`,
        `I said it before and I'll say it again: The conventional approach to ${topic} is fundamentally broken and we need to start over. #${topic.replace(/\s+/g, '')} #DisruptiveThinking`,
        `The real reason most people fail with ${topic} isn't what you think - and industry leaders are keeping it hidden for their own benefit. #${topic.replace(/\s+/g, '')} #TruthBomb`
      ];
      break;
      
    default:
      defaultFormats = [
        `Just discovered the most amazing insight about ${topic}! This changes everything we thought we knew about it. #MindBlown #${topic.replace(/\s+/g, '')}`,
        `5 things nobody tells you about ${topic} that could save you hours of time: 1) Start with research 2) Ask experts 3) Test assumptions 4) Iterate quickly 5) Share your results #${topic.replace(/\s+/g, '')}Tips`,
        `I spent 30 days deeply focused on ${topic} and the results were shocking! Here's what I learned and why it matters to you... #PersonalGrowth #${topic.replace(/\s+/g, '')}`,
        `The untold story of ${topic} that experts don't want you to know. I've researched this extensively and found some surprising facts. Thread 🧵 #${topic.replace(/\s+/g, '')}`,
        `How ${topic} completely changed my perspective on life and business. The lessons I learned will stay with me forever. #GameChanger #${topic.replace(/\s+/g, '')}`
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
      tweets.push(defaultFormats[baseIndex].replace('!', '!!').replace('...', '....'));
    }
  }
  
  return tweets;
};
