
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { TweetData, GenerationOptions } from "../types/tweet";

// Initialize Gemini model with API key
const initializeGeminiModel = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error("Google API Key not found. Please set VITE_GOOGLE_API_KEY in your environment variables.");
  }
  
  return new ChatGoogleGenerativeAI({
    apiKey,
    modelName: "gemini-1.5-flash-latest", // Using gemini-1.5-flash-latest as it's supported in the current integration
  });
};

// Create prompt template for generating tweets
const createPromptTemplate = () => {
  return new PromptTemplate({
    template: "Give me {number} tweets on {topic} in English.",
    inputVariables: ["number", "topic"],
  });
};

export const generateTweets = async (topic: string, count: number): Promise<string[]> => {
  try {
    // If API key is not set, fall back to mock implementation
    if (!import.meta.env.VITE_GOOGLE_API_KEY) {
      console.warn("Using mock tweet generation because API key is not set");
      return generateMockTweets(topic, count);
    }
    
    const geminiModel = initializeGeminiModel();
    const promptTemplate = createPromptTemplate();
    
    // Use the chain approach with the pipe operator (|)
    const chain = promptTemplate.pipe(geminiModel);
    
    // Call the chain with the input parameters
    const response = await chain.invoke({
      number: count,
      topic: topic
    });
    
    // Extract and parse tweets from the response
    const content = response.content;
    let tweetText = '';
    
    // Handle different response content formats
    if (typeof content === 'string') {
      tweetText = content;
    } else if (Array.isArray(content)) {
      // For multi-part responses, join all text parts
      tweetText = content
        .filter(item => typeof item === 'object')
        .map(item => {
          // Check various possible properties where text content might be found
          if ('text' in item) {
            return item.text;
          } else if ('value' in item) {
            return item.value;
          } else if ('content' in item) {
            return item.content;
          } else {
            // Try to stringify the object if none of the expected properties exist
            try {
              return JSON.stringify(item);
            } catch {
              return '';
            }
          }
        })
        .join('\n');
    }
    
    console.log("Response from Gemini API:", tweetText);
    
    // Split the content by numbered list entries and filter empty lines
    const tweets = tweetText
      .split(/\d+\.\s+/)
      .filter(tweet => tweet.trim().length > 0)
      .map(tweet => tweet.trim())
      .slice(0, count); // Ensure we return exactly the requested count
    
    return tweets.length ? tweets : generateMockTweets(topic, count);
  } catch (error) {
    console.error("Error generating tweets:", error);
    // Fallback to mock implementation if API call fails
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
