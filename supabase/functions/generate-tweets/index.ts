import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get the Google API key from Supabase secrets
const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle tweet generation
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { topic, count = 1, tone = "professional" } = await req.json();
    
    console.log(`Generating ${count} ${tone} tweets about "${topic}" with Gemini`);

    if (!googleApiKey) {
      throw new Error('GOOGLE_API_KEY is not set in Supabase secrets');
    }

    // Create a more engaging prompt for Gemini - improved to get more viral content
    const prompt = `Generate ${count} unique, engaging tweets about "${topic}" in English with a ${tone} tone. Ensure that these tweets are amicable to varied age groups of tweeters.

    For reference, here's how I define each tone:
      - Professional: Formal, authoritative, using industry terms or cultural impact
      - Casual: Friendly, conversational, with contractions, emojis, and relatable vibes
      - Humorous: Witty, light-hearted, with cultural references or playful jabs
      - Inspirational: Uplifting, legacy-driven, rallying action or pride
      - Informative: Fact-based, sharing impactful or surprising insights
      - Controversial: Bold, thought-provoking, challenging norms with balanced viewpoints 
    
    Each tweet MUST:
    - Use lively language and questions to spark conversation
    - End with an open-ended question to drive replies and shares
    - Match the requested ${tone} tone perfectly
    - Not include the number in the actual tweet content
    - Include 3-4 relevant, trending hashtags tied to "${topic}" or cultural moments
    - Be compelling enough to go viral with emotional or cultural hooks
    - Be formatted as a numbered list
    - Be 150-200 characters (max 280) to allow retweets
    - Include 1-2 emojis fitting the tone for visual pop

    Format: 
    1. [First tweet content]
    2. [Second tweet content]
    etc.`;

    // Make request to Google Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': googleApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.5, // Higher temperature for more creative tweets
          topK: 40,
          topP: 0.80,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(`Gemini API error: ${data.error?.message || 'Unknown error'}`);
    }

    // Extract tweets from the response
    const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Raw response from Gemini:', contentText);
    
    // Parse the numbered list of tweets more effectively
    const tweetRegex = /\d+\.\s+(.*?)(?=\d+\.|$)/gs;
    let match;
    const tweets = [];
    
    while ((match = tweetRegex.exec(contentText)) !== null && tweets.length < count) {
      const tweetContent = match[1].trim();
      if (tweetContent && tweetContent.length <= 280) {
        tweets.push(tweetContent);
      }
    }
    
    // If regex parsing didn't work well, fall back to the previous method
    if (tweets.length === 0) {
      const fallbackTweets = contentText
        .split(/\d+\.\s+/) // Split by numbers followed by dot and space
        .filter(tweet => tweet.trim().length > 0) // Remove empty entries
        .map(tweet => tweet.trim()) // Clean up whitespace
        .filter(tweet => tweet.length <= 280); // Make sure tweets don't exceed 280 chars
      
      // Ensure we exactly get the requested number of tweets (up to what's available)
      const availableTweets = fallbackTweets.slice(0, count);
      tweets.push(...availableTweets);
    }
    
    console.log(`Successfully generated ${tweets.length} tweets`);

    return new Response(
      JSON.stringify({ 
        tweets,
        success: true
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in generate-tweets function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        success: false 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
