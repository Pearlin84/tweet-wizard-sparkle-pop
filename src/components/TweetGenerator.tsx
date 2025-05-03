
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import TweetGeneratorForm from './TweetGeneratorForm';
import TweetResultsList from './TweetResultsList';
import { generateTweets } from '../utils/tweetGenerator';

const TweetGenerator = () => {
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
      
      const generatedTweets = await generateTweets(topic, tweetCount, tone);
      setTweets(generatedTweets);
      setHasGenerated(true);
      
      toast({
        title: "Tweets generated!",
        description: `We've created ${generatedTweets.length} ${tone} tweets using Gemini AI`,
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
    <div className="w-full max-w-3xl mx-auto">
      <TweetGeneratorForm 
        onSubmit={handleGenerateTweets}
        onClear={handleClearTweets}
        isLoading={isLoading} 
      />
      {hasGenerated && <TweetResultsList tweets={tweets} />}
      
      <div className="mt-8 p-4 text-sm text-muted-foreground border border-muted rounded-lg">
        <p className="font-semibold mb-2">Disclaimer:</p>
        <p>This is a tweet generation tool only. Always fact-check information and verify sources before sharing. Responsible content sharing is essential for maintaining credibility and preventing misinformation.</p>
      </div>
    </div>
  );
};

export default TweetGenerator;
