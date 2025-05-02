
// This function uses Google's Generative AI (Gemini) to generate tweets
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatGoogleGenerativeAI } from "https://esm.sh/@langchain/google-genai@0.1.7";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Google API key from environment variables
    const apiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error("Google API Key not found in environment variables");
    }

    // Parse request body to get topic and count
    const { topic, count } = await req.json();
    if (!topic || !count) {
      throw new Error("Missing required parameters: topic and count");
    }

    console.log(`Generating ${count} tweets about "${topic}"`);

    // Initialize the Gemini model
    const model = new ChatGoogleGenerativeAI({
      apiKey,
      modelName: "gemini-2.0-flash", // Using Gemini 2.0 Flash as requested
    });

    // Create and send the prompt
    const prompt = `Give me ${count} tweets on ${topic} in English.`;
    const response = await model.invoke([
      { 
        type: "human", 
        text: prompt 
      }
    ]);

    // Process the response to extract tweets
    const content = response.text;
    console.log("Raw response from Gemini:", content);

    // Parse numbered tweets from the content
    // Split by numbered list entries and filter empty lines
    const tweets = content
      .split(/\d+\.\s+/) // Split by numbered list format
      .filter(tweet => tweet.trim().length > 0)
      .map(tweet => tweet.trim())
      .slice(0, count); // Ensure we return exactly the requested count

    console.log(`Successfully generated ${tweets.length} tweets`);

    // Return the generated tweets
    return new Response(
      JSON.stringify({ tweets }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error generating tweets:", error);
    
    // Return a proper error response
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to generate tweets",
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
