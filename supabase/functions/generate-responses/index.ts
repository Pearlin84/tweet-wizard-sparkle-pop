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
   const prompt = `Generate ${count} unique, engaging response tweets to this tweet: "${tweet}" in English with a ${tone} tone, crafted to maximize virality and spark discussion on X, appealing to diverse age groups.

**Instructions**:
- **Content**: Create concise responses (150-200 characters, max 280) that directly address the content, context, and sentiment of "${tweet}". Incorporate real-time X trends or cultural references related to the tweet’s topic to boost relevance. Ensure responses are strictly relevant to the original tweet.
- **Tone Definitions**:
  - Professional: Formal, authoritative, using industry-specific terms or cultural impact.
  - Casual: Friendly, conversational, with contractions, emojis, and relatable vibes.
  - Humorous: Witty, light-hearted, with cultural references or playful jabs.
  - Inspirational: Uplifting, motivational, rallying action or pride.
  - Informative: Fact-based, sharing surprising or impactful insights.
  - Controversial: Bold, thought-provoking, challenging norms with balanced viewpoints.
- **Requirements**:
  - Each response must be unique, distinct, and directly relevant to "${tweet}".
  - Use lively, engaging language to spark conversation and emotional connection.
  - End with an open-ended question to drive replies, retweets, and further discussion.
  - Include 1-2 relevant hashtags (if applicable) tied to the tweet’s topic or current trends to enhance discoverability, avoiding spammy overuse.
  - Include 1-2 emojis matching the tone for visual appeal.
  - Ensure content is inclusive, appropriate, and avoids spammy or sensitive elements.
  - Optimize for X algorithm: Prioritize engagement (replies, likes, retweets), relevance to the original tweet, and recency.
  - Format as a numbered list (e.g., 1. [Response content], 2. [Response content]).
  - Avoid repetitive phrases or off-topic content to maintain authenticity and virality.

**Format Example**:
1. [Response content with emojis, 1-2 hashtags, and a question]
2. [Response content with emojis, 1-2 hashtags, and a question]
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
