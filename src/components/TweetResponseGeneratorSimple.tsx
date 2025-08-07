import { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGenerateResponse } from "@/hooks/useGenerateResponse";
import TweetResponsesList from "@/components/TweetResponsesList";

const TweetResponseGeneratorSimple = () => {
  const [originalTweet, setOriginalTweet] = useState('');
  const [tone, setTone] = useState('professional');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Always generate 2 responses for all users (unlimited mode)
  const responseCount = 2;
  
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
        user_id: undefined // No user tracking in unlimited mode
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tweet" className="block text-sm font-medium mb-1">
            Paste the tweet you want to respond to:
          </label>
          <Textarea
            id="tweet"
            ref={textareaRef}
            value={originalTweet}
            onChange={handleTextareaChange}
            placeholder="Paste the tweet here..."
            className="min-h-[60px] w-full resize-none overflow-hidden"
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
          <p>Generate multiple response options to find the perfect tone for your reply!</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="flex-1 bg-tweet-purple hover:bg-tweet-purple/90"
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

export default TweetResponseGeneratorSimple;