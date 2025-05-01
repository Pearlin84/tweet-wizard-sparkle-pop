
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ThumbsUp, Share, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

interface TweetResultProps {
  content: string;
  delay: number;
}

export const TweetResult = ({ content, delay }: TweetResultProps) => {
  const [visible, setVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({
      description: "Tweet copied to clipboard!",
      duration: 1500,
    });
  };
  
  // If not visible yet due to staggered animation, don't render anything
  if (!visible) return null;
  
  return (
    <div 
      className="tweet-card animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 border-2 border-tweet-purple/20">
          <div className="h-full w-full rounded-full bg-gradient-to-br from-tweet-purple to-tweet-blue"></div>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <div className="font-semibold">Twitter User</div>
            <div className="text-muted-foreground text-sm">@twitteruser</div>
          </div>
          
          <div className="my-3 text-base">
            {content}
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="flex gap-4 text-muted-foreground">
              <div className="flex items-center gap-1 hover:text-tweet-purple transition-colors cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs">24</span>
              </div>
              
              <div 
                className={`flex items-center gap-1 cursor-pointer transition-colors ${liked ? 'text-tweet-pink' : 'hover:text-tweet-pink'}`}
                onClick={() => setLiked(!liked)}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs">{liked ? '147' : '146'}</span>
              </div>
              
              <div 
                className="flex items-center gap-1 hover:text-tweet-blue transition-colors cursor-pointer"
                onClick={handleCopyToClipboard}
              >
                <Share className="w-4 h-4" />
                <span className="text-xs">31</span>
              </div>
            </div>
            
            <Button 
              onClick={handleCopyToClipboard}
              variant="outline" 
              size="sm"
              className="text-xs h-7 px-3 rounded-full border-tweet-purple hover:bg-tweet-purple/10"
            >
              Copy Tweet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
