
import { Twitter } from 'lucide-react';
import { TweetResult } from './TweetResult';

interface TweetResultsListProps {
  tweets: string[];
}

const TweetResultsList = ({ tweets }: TweetResultsListProps) => {
  if (tweets.length === 0) return null;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Twitter className="w-5 h-5 text-tweet-purple" />
        <h2 className="text-xl font-semibold">Your viral tweets</h2>
      </div>
      
      <div className="space-y-6">
        {tweets.map((tweet, index) => (
          <TweetResult key={index} content={tweet} delay={index * 200} />
        ))}
      </div>
    </div>
  );
};

export default TweetResultsList;
