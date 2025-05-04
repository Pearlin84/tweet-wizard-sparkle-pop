
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Search, Send, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TweetGeneratorFormProps {
  onSubmit: (topic: string, count: number, tone: string) => Promise<void>;
  onClear: () => void;
  isLoading: boolean;
}

const TweetGeneratorForm = ({ onSubmit, onClear, isLoading }: TweetGeneratorFormProps) => {
  const [topic, setTopic] = useState('');
  const [tweetCount, setTweetCount] = useState(3);
  const [tone, setTone] = useState('professional');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to generate tweets",
        variant: "destructive"
      });
      return;
    }
    
    if (tweetCount < 1 || tweetCount > 10) {
      toast({
        title: "Invalid number of tweets",
        description: "Please enter a number between 1 and 10",
        variant: "destructive"
      });
      return;
    }
    
    await onSubmit(topic, tweetCount, tone);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <Card className="p-6 shadow-lg border-2 border-muted bg-card/50 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5 text-tweet-purple" />
            <h2 className="text-xl font-semibold">Tweet Generator</h2>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tweet-count" className="block text-sm font-medium mb-1">
                  Number of tweets (1-10)
                </label>
                <Input 
                  id="tweet-count"
                  type="number"
                  min="1"
                  max="10"
                  value={tweetCount}
                  onChange={(e) => setTweetCount(Number(e.target.value))}
                  className="w-full max-w-[150px] border-2 border-muted focus-visible:ring-tweet-purple"
                />
              </div>
              
              <div>
                <label htmlFor="tweet-tone" className="block text-sm font-medium mb-1">
                  Tweet tone
                </label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="w-full max-w-[250px] border-2 border-muted focus-visible:ring-tweet-purple">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="controversial">Controversial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label htmlFor="tweet-topic" className="block text-sm font-medium mb-1">
                Tweet topic
              </label>
              <Textarea
                id="tweet-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="enter your topic to tweet - e.g., Sustainable fashion, gemini pro ... "
                className="min-h-[120px] text-lg rounded-xl border-2 border-muted focus-visible:ring-tweet-purple"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline"
              className="rounded-full border-tweet-purple text-tweet-purple font-medium px-6 py-6"
              onClick={onClear}
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Clear Tweets</span>
              </div>
            </Button>
            <Button 
              type="submit" 
              className="rounded-full bg-tweet-purple hover:bg-tweet-purple/90 text-white font-medium px-6 py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating tweets...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Generate Viral Tweets</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default TweetGeneratorForm;
