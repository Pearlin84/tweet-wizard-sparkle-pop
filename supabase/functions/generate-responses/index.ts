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

    Generate responses with a ${tone} tone.
    
   For reference, here's how I define each tone:
      - Professional: Formal, authoritative, using industry terms or cultural impact
      - Casual: Friendly, conversational, with contractions, emojis, and relatable vibes
      - Humorous: Witty, light-hearted, with cultural references or playful jabs
      - Inspirational: Uplifting, legacy-driven, rallying action or pride
      - Informative: Fact-based, sharing impactful or surprising insights
      - Controversial: Bold, thought-provoking, challenging norms with balanced viewpoints 
    
    Each response MUST:
    - Be unique and different from others   
    - Use lively language and questions to spark conversation.
    - End with an open-ended question to drive replies and shares
    - Match the requested ${tone} tone perfectly
    - Not include the number in the actual tweet content
    - Include 3-4 relevant, trending hashtags tied to the topic or cultural moments
    - Be compelling enough to go viral
    - Be formatted as a numbered list
    - Be 150-200 characters (max 280) to allow retweets
    - Include 1-2 emojis fitting the tone for visual pop
    - Be appropriate as a direct reply to the tweet
    
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
