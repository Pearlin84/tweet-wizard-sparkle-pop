import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get the Google API key from Supabase secrets
const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle tweet response generation
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { tweet, count = 1, tone = "professional" } = await req.json();
    
    console.log(`Generating ${count} ${tone} responses to tweet: "${tweet}" with Gemini`);

    if (!googleApiKey) {
      throw new Error('GOOGLE_API_KEY is not set in Supabase secrets');
    }

    // Create a prompt for Gemini to generate responses
    const prompt = `I need ${count} unique, engaging responses to this tweet: "${tweet}"

    Please generate responses with a ${tone} tone.
    
    For reference, here's how I define each tone:
    - Professional: Formal, business-oriented responses with industry terms
    - Casual: Friendly, conversational, using contractions and emoji
    - Humorous: Witty, funny, with jokes or puns related to the tweet
    - Inspirational: Uplifting, motivational, encouraging positive action
    - Informative: Educational, fact-based, sharing knowledge and insights
    - Controversial: Challenging conventional wisdom, presenting alternative viewpoints
    
    Each response MUST:
    - Be unique and different from others
    - Be engaging and conversational
    - Match the requested ${tone} tone perfectly
    - Be appropriate as a direct reply to the tweet
    - Be formatted as a numbered list
    - Not exceed 280 characters
    - Not include the number in the actual response content
    
    Format: 
    1. [First response content]
    2. [Second response content]
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
          temperature: 0.75,
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

    // Extract responses from the response
    const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Raw response from Gemini:', contentText);
    
    // Parse the numbered list of responses
    const responseRegex = /\d+\.\s+(.*?)(?=\d+\.|$)/gs;
    let match;
    const responses = [];
    
    while ((match = responseRegex.exec(contentText)) !== null && responses.length < count) {
      const responseContent = match[1].trim();
      if (responseContent && responseContent.length <= 280) {
        responses.push(responseContent);
      }
    }
    
    // If regex parsing didn't work well, fall back to the previous method
    if (responses.length === 0) {
      const fallbackResponses = contentText
        .split(/\d+\.\s+/) // Split by numbers followed by dot and space
        .filter(response => response.trim().length > 0) // Remove empty entries
        .map(response => response.trim()) // Clean up whitespace
        .filter(response => response.length <= 280); // Make sure responses don't exceed 280 chars
      
      // Get the requested number of responses (up to what's available)
      const availableResponses = fallbackResponses.slice(0, count);
      responses.push(...availableResponses);
    }
    
    console.log(`Successfully generated ${responses.length} responses`);

    return new Response(
      JSON.stringify({ 
        responses,
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
    console.error('Error in generate-responses function:', error);
    
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
