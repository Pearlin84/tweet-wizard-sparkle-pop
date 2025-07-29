
import { Twitter } from 'lucide-react';
import { TweetResult } from './TweetResult';

interface TweetResultsListProps {
  tweets: string[];
}

const TweetResultsList = ({ tweets }: TweetResultsListProps) => {
  if (tweets.length === 0) return null;
  
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in mt-6 sm:mt-8">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-tweet-purple flex-shrink-0" />
        <h2 className="text-lg sm:text-xl font-semibold">Your viral tweets</h2>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {tweets.map((tweet, index) => (
          <TweetResult key={index} content={tweet} delay={index * 200} />
        ))}
      </div>
    </div>
  );
};

export default TweetResultsList;
