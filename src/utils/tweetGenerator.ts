import { supabase } from "../integrations/supabase/client";
import { TweetData, GenerationOptions } from "../types/tweet";

export const generateTweets = async (topic: string, count: number): Promise<string[]> => {
  try {
    console.log(`Requesting ${count} tweets about "${topic}" from Edge Function`);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-tweets', {
      body: { topic, count }
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
    return generateMockTweets(topic, count);
  }
};

// Mock tweet generation as fallback
const generateMockTweets = (topic: string, count: number): string[] => {
  // Mock a loading time
  console.log("Using mock tweet generator");
  
  // Build the mock prompt response using the template
  const tweets = [];
  const defaultFormats = [
    `Just discovered the most amazing insight about ${topic}! This changes everything we thought we knew about it. #MindBlown #${topic.replace(/\s+/g, '')}`,
    `5 things nobody tells you about ${topic} that could save you hours of time: 1) Start with research 2) Ask experts 3) Test assumptions 4) Iterate quickly 5) Share your results #${topic.replace(/\s+/g, '')}Tips`,
    `I spent 30 days deeply focused on ${topic} and the results were shocking! Here's what I learned and why it matters to you... #PersonalGrowth #${topic.replace(/\s+/g, '')}`,
    `The untold story of ${topic} that experts don't want you to know. I've researched this extensively and found some surprising facts. Thread 🧵 #${topic.replace(/\s+/g, '')}`,
    `How ${topic} completely changed my perspective on life and business. The lessons I learned will stay with me forever. #GameChanger #${topic.replace(/\s+/g, '')}`
  ];
  
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
