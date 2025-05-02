
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
    const { topic, count } = await req.json();
    
    console.log(`Generating ${count} tweets about "${topic}" with Gemini`);

    if (!googleApiKey) {
      throw new Error('GOOGLE_API_KEY is not set in Supabase secrets');
    }

    // Create the prompt for Gemini
    const prompt = `Generate ${count} unique, engaging tweets about ${topic} in English. Each tweet should:
    - Be unique and different from others
    - Include relevant hashtags
    - Be engaging and shareable
    - Be formatted as a numbered list
    - Not exceed 280 characters
    - Not include the number in the actual tweet content
    
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
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
    
    // Parse the numbered list of tweets
    const tweets = contentText
      .split(/\d+\.\s+/) // Split by numbers followed by dot and space
      .filter(tweet => tweet.trim().length > 0) // Remove empty entries
      .map(tweet => tweet.trim()) // Clean up whitespace
      .filter(tweet => tweet.length <= 280) // Make sure tweets don't exceed 280 chars
      .slice(0, count); // Limit to requested count
    
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
