
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import TweetGeneratorForm from './TweetGeneratorForm';
import TweetResultsList from './TweetResultsList';
import { generateTweets, getUserSegmentInfo } from '../utils/tweetGenerator';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock } from 'lucide-react';
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const TweetGenerator = () => {
  const [tweets, setTweets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [userSegment, setUserSegment] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Load user segment info when component mounts
    loadUserSegmentInfo();
  }, []);

  const loadUserSegmentInfo = async () => {
    try {
      const segmentInfo = await getUserSegmentInfo();
      setUserSegment(segmentInfo);
    } catch (error) {
      console.error('Error loading user segment info:', error);
    }
  };

  const handleGenerateTweets = async (topic: string, tweetCount: number, tone: string) => {
    try {
      setIsLoading(true);
      toast({
        title: "Generating tweets",
        description: `Working on ${tweetCount} ${tone} tweets about "${topic}"...`,
      });
      
      const generatedTweets = await generateTweets(topic, tweetCount, tone);
      
      // Check if we got fewer tweets than requested due to limits
      if (generatedTweets.length < tweetCount) {
        // User hit limits, show appropriate message
        toast({
          title: "Usage limit reached",
          description: userSegment?.type === 'guest' 
            ? "Sign up for free to generate more tweets!" 
            : "Upgrade your plan to generate more tweets!",
          variant: "destructive"
        });
      }
      
      setTweets(generatedTweets);
      setHasGenerated(true);
      
      // Refresh user segment info after generation
      loadUserSegmentInfo();
      
      toast({
        title: "Tweets generated!",
        description: `We've created ${generatedTweets.length} ${tone} tweets for you`,
      });
    } catch (error) {
      console.error('Error generating tweets:', error);
      
      if (error instanceof Error && error.message === "Tweet generation limit reached") {
        toast({
          title: "Usage limit reached",
          description: userSegment?.type === 'guest' 
            ? "Sign up for free to generate more tweets!" 
            : "Upgrade your plan to generate more tweets!",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Generation failed",
          description: "There was an error generating tweets. Please try again.",
          variant: "destructive"
        });
      }
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

  const getUsageDescription = (type: string) => {
    if (type === 'guest') {
      return "In guest mode, you can only generate 2 times and only 2 tweet variations per generation.";
    } else if (type === 'free') {
      return "As a free user, you can generate tweets 5 times with 2 tweet variations per generation.";
    } else if (type === 'basic') {
      return "As a basic user, you can generate up to 30 tweets per day.";
    } else {
      return "As a pro user, you can generate up to 100 tweets per day.";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto" id="tweet-generator">
      {/* User segment info */}
      {userSegment && (
        <div className="mb-6 p-4 border border-muted rounded-lg bg-card/50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">
              {userSegment.type === 'guest' ? 'Guest' : 
               userSegment.type === 'free' ? 'Free User' :
               userSegment.type === 'basic' ? 'Basic Plan' : 'Pro Plan'}
            </h3>
            <span className="text-sm text-muted-foreground">
              {userSegment.usageInfo.used} / {userSegment.usageInfo.limit} tweets
            </span>
          </div>
          
          <Progress value={userSegment.usageInfo.percentage} className="h-2 mb-2" />
          
          <div className="text-sm text-muted-foreground mt-2 mb-2">
            {getUsageDescription(userSegment.type)}
          </div>
          
          {userSegment.upgradeMessage && (
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-muted-foreground">{userSegment.upgradeMessage}</p>
              <Button 
                size="sm" 
                variant="default" 
                className="bg-tweet-purple hover:bg-tweet-purple/90"
                asChild
              >
                <Link to={userSegment.type === 'guest' ? "/auth" : "/upgrade"}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>{userSegment.type === 'guest' ? "Sign Up" : "Upgrade"}</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
      
      <TweetGeneratorForm 
        onSubmit={handleGenerateTweets}
        onClear={handleClearTweets}
        isLoading={isLoading} 
      />
      {hasGenerated && <TweetResultsList tweets={tweets} />}
      
      <div className="mt-8 p-4 text-sm text-muted-foreground border border-muted rounded-lg">
        <p className="font-semibold mb-2">Disclaimer:</p>
        <p>This is an AI-powered tweet generation tool. Always fact-check and verify sources before sharing. Use it responsibly to avoid spreading misinformation or misleading content.</p>
        <p> ~  PEACE  ~ </p>
      </div>
    </div>
  );
};

export default TweetGenerator;
