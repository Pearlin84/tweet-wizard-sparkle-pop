
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface TweetGeneratorFormProps {
  onSubmit: (topic: string, count: number, tone: string) => Promise<void>;
  onClear: () => void;
  isLoading: boolean;
}

const TweetGeneratorForm = ({ onSubmit, onClear, isLoading }: TweetGeneratorFormProps) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Set the tweet count based on user status (authenticated vs guest)
  const tweetCount = user ? 2 : 1;
  
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'informative', label: 'Informative' },
    { value: 'controversial', label: 'Controversial' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      return;
    }
    
    await onSubmit(topic, tweetCount, tone);
  };
  
  // Handle textarea auto-resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setTopic(textarea.value);
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Set the height to scrollHeight to expand as needed
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium mb-1">
          What would you like to tweet about?
        </label>
        <Textarea
          id="topic"
          ref={textareaRef}
          value={topic}
          onChange={handleTextareaChange}
          placeholder="Enter a topic or keyword"
          className="w-full min-h-[60px] resize-none overflow-hidden"
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
          <p>You'll receive 2 tweets for A/B testing.</p>
        ) : (
          <p>Guest users receive 1 tweet. Sign in to get 2 tweets for A/B testing!</p>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="flex-1 bg-tweet-purple hover:bg-tweet-purple/90"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Tweets
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={onClear}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    </form>
  );
};

export default TweetGeneratorForm;
