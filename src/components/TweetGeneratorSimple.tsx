import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import TweetGeneratorForm from './TweetGeneratorForm';
import TweetResultsList from './TweetResultsList';
import { generateTweets } from '../utils/tweetGenerator';

const TweetGeneratorSimple = () => {
  const [tweets, setTweets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerateTweets = async (topic: string, tweetCount: number, tone: string) => {
    try {
      setIsLoading(true);
      toast({
        title: "Generating tweets",
        description: `Working on ${tweetCount} ${tone} tweets about "${topic}"...`,
      });
      
      const generatedTweets = await generateTweets(topic, tweetCount, tone, true); // true for unlimited
      
      setTweets(generatedTweets);
      setHasGenerated(true);
      
      toast({
        title: "Tweets generated!",
        description: `We've created ${generatedTweets.length} ${tone} tweets for you`,
      });
    } catch (error) {
      console.error('Error generating tweets:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating tweets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearTweets = () => {
    if (tweets.length > 0) {
      setTweets([]);
      setHasGenerated(false);
      toast({
        title: "Tweets cleared",
        description: "All generated tweets have been cleared.",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Welcome message */}
      <div className="mb-6 p-4 border border-muted rounded-lg bg-card/50">
        <div className="text-center">
          <p className="text-lg font-medium text-tweet-purple mb-2">
            ✨ Welcome to PostQuill! ✨
          </p>
          <p className="text-sm text-muted-foreground">
            Create unlimited viral tweets and responses with AI assistance. 
            No sign-up required - just start creating amazing content!
          </p>
        </div>
      </div>
      
      <TweetGeneratorForm 
        onSubmit={handleGenerateTweets}
        onClear={handleClearTweets}
        isLoading={isLoading} 
      />
      {hasGenerated && <TweetResultsList tweets={tweets} />}
    </div>
  );
};

export default TweetGeneratorSimple;