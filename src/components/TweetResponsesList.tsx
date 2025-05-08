
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TweetResponsesListProps {
  responses: string[];
}

const TweetResponsesList = ({ responses }: TweetResponsesListProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      toast({
        description: "Response copied to clipboard!",
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Generated Responses:</h3>
      
      <div className="space-y-4">
        {responses.map((response, index) => (
          <Card key={index} className="p-4 relative bg-white border border-gray-200">
            <div className="pr-8">
              <p className="text-gray-800">{response}</p>
            </div>
            <button
              onClick={() => handleCopy(response, index)}
              className="absolute right-4 top-4 text-gray-500 hover:text-tweet-purple"
              aria-label="Copy response to clipboard"
            >
              {copiedIndex === index ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TweetResponsesList;
