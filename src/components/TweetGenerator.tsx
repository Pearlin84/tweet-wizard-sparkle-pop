
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import TweetGeneratorForm from './TweetGeneratorForm';
import TweetResultsList from './TweetResultsList';
import { generateTweets } from '../utils/tweetGenerator';

const TweetGenerator = () => {
  const [tweets, setTweets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerateTweets = async (topic: string, tweetCount: number) => {
    try {
      setIsLoading(true);
      // In a production app with Supabase, we would:
      // 1. Check authentication status
      // 2. Include user_id in requests
      // 3. Implement proper error logging
      // 4. Implement proper data validation
      const generatedTweets = await generateTweets(topic, tweetCount);
      setTweets(generatedTweets);
      setHasGenerated(true);
      toast({
        title: "Tweets generated!",
        description: `We've created ${generatedTweets.length} viral tweets for your topic`,
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

  return (
    <div className="w-full max-w-3xl mx-auto">
      <TweetGeneratorForm onSubmit={handleGenerateTweets} isLoading={isLoading} />
      {hasGenerated && <TweetResultsList tweets={tweets} />}
    </div>
  );
};

export default TweetGenerator;
