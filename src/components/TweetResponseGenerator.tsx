
import { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MessageSquare, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useGenerateResponse } from "@/hooks/useGenerateResponse";
import TweetResponsesList from "@/components/TweetResponsesList";

const TweetResponseGenerator = () => {
  const [originalTweet, setOriginalTweet] = useState('');
  const [tone, setTone] = useState('professional');
  const { user } = useAuth();
  
  // Set response count based on user status (guest vs authenticated)
  const responseCount = user ? 2 : 1;
  
  const { 
    generateResponses, 
    responses, 
    isGenerating, 
    error,
    clearResponses 
  } = useGenerateResponse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalTweet.trim()) {
      toast({
        title: "No tweet provided",
        description: "Please paste a tweet to respond to.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await generateResponses({
        tweet: originalTweet,
        count: responseCount,
        tone,
        user_id: user?.id
      });
    } catch (err) {
      console.error("Error generating responses:", err);
    }
  };
  
  // Handle textarea auto-resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setOriginalTweet(textarea.value);
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Set the height to scrollHeight to expand as needed
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'informative', label: 'Informative' },
    { value: 'controversial', label: 'Controversial' }
  ];
  
  const handleClear = () => {
    setOriginalTweet('');
    clearResponses();
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-white/50 backdrop-blur-sm border border-gray-200 shadow-md rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-tweet-purple to-tweet-blue bg-clip-text text-transparent">
          Tweet Response Generator
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tweet" className="block text-sm font-medium mb-1">
              Paste the tweet you want to respond to:
            </label>
            <Textarea
              id="tweet"
              value={originalTweet}
              onChange={handleTextareaChange}
              placeholder="Paste the tweet here..."
              className="min-h-[60px] w-full border-gray-300 resize-none overflow-hidden"
              rows={1}
            />
          </div>
          
          <div>
            <label htmlFor="tone" className="block text-sm font-medium mb-1">
              Tone:
            </label>
            <select 
              id="tone" 
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {user ? (
              <p>You'll receive 2 tweet responses for A/B testing.</p>
            ) : (
              <p>Guest users receive 1 tweet response. Sign in for more options!</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1 bg-tweet-purple hover:bg-tweet-purple/90 text-white"
              disabled={isGenerating || !originalTweet.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Generate Responses
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={handleClear}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </form>
      </Card>
      
      {responses.length > 0 && (
        <TweetResponsesList responses={responses} />
      )}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default TweetResponseGenerator;
