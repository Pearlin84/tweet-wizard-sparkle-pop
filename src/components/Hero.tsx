
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/70 relative">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="mx-auto max-w-[800px] space-y-4">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              Create <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text animate-gradient">viral tweets</span> for any topic in seconds
            </h1>
            
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Turn your ideas into engaging, share-worthy content that connects with your audience and drives more interactions
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button 
                asChild
                size="lg" 
                className="bg-tweet-purple hover:bg-tweet-purple/90 text-white gap-2 px-8 py-6 rounded-full"
              >
                <a href="#tweet-generator">
                  <Send className="w-5 h-5" />
                  <span>Generate Tweets</span>
                </a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="gap-2 px-8 py-6 rounded-full border-tweet-purple text-tweet-purple hover:bg-tweet-purple/10"
              >
                <Link to="/auth">
                  <Sparkles className="w-5 h-5" />
                  <span>Sign Up</span>
                </Link>
              </Button>
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Pro Tips for Better Tweets:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                <div className="flex gap-2 items-start">
                  <Tag className="w-5 h-5 text-tweet-purple mt-0.5" />
                  <p className="text-sm">Be specific with your topic and target audience</p>
                </div>
                <div className="flex gap-2 items-start">
                  <Tag className="w-5 h-5 text-tweet-purple mt-0.5" />
                  <p className="text-sm">Include industry terms or trending keywords</p>
                </div>
                <div className="flex gap-2 items-start">
                  <Tag className="w-5 h-5 text-tweet-purple mt-0.5" />
                  <p className="text-sm">Add context like "for beginners" or "latest trends"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
