
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";

interface TweetGeneratorFormProps {
  onSubmit: (topic: string, count: number, tone: string) => Promise<void>;
  onClear: () => void;
  isLoading: boolean;
}

const TweetGeneratorForm = ({ onSubmit, onClear, isLoading }: TweetGeneratorFormProps) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Always generate 2 tweets for all users (unlimited mode)
  const tweetCount = 2;
  
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
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div>
        <label htmlFor="topic" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
          What would you like to tweet about?
        </label>
        <Textarea
          id="topic"
          ref={textareaRef}
          value={topic}
          onChange={handleTextareaChange}
          placeholder="Enter a topic or keyword"
          className="w-full min-h-[60px] sm:min-h-[80px] resize-none overflow-hidden text-sm sm:text-base touch-manipulation"
          rows={1}
        />
      </div>
      
      <div>
        <label htmlFor="tone" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
          Tone:
        </label>
        <select 
          id="tone" 
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px] touch-manipulation"
        >
          {toneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="text-xs sm:text-sm text-muted-foreground p-2 sm:p-3 bg-muted/30 rounded-lg">
        <p>You'll receive 2 tweets for A/B testing and unlimited generations!</p>
      </div>
      
      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
        <Button 
          type="submit" 
          className="flex-1 bg-tweet-purple hover:bg-tweet-purple/90 min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium touch-manipulation"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1.5 sm:mr-2 h-4 w-4 animate-spin" />
              <span className="hidden xs:inline">Generating...</span>
              <span className="xs:hidden">Loading...</span>
            </>
          ) : (
            <>
              <Sparkles className="mr-1.5 sm:mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Generate Tweets</span>
              <span className="xs:hidden">Generate</span>
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={onClear}
          className="xs:w-auto w-full min-h-[44px] sm:min-h-[48px] text-sm sm:text-base font-medium px-4 sm:px-6 touch-manipulation"
        >
          <RefreshCw className="mr-1.5 sm:mr-2 h-4 w-4" />
          <span className="hidden xs:inline">Clear</span>
          <span className="xs:hidden">Clear</span>
        </Button>
      </div>
    </form>
  );
};

export default TweetGeneratorForm;
