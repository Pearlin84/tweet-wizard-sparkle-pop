
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/70 relative overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 text-center">
          <div className="mx-auto max-w-[320px] xs:max-w-[400px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] space-y-3 sm:space-y-4">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Create <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text animate-gradient">viral tweets</span> for any topic in seconds
            </h1>
            
            <p className="mx-auto max-w-[280px] xs:max-w-[350px] sm:max-w-[500px] md:max-w-[600px] text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl dark:text-gray-400 leading-relaxed">
              Turn your ideas into engaging, share-worthy content that connects with your audience and drives more interactions
            </p>
            
            {!user && (
              <p className="mx-auto max-w-[280px] xs:max-w-[350px] sm:max-w-[500px] md:max-w-[600px] mt-2 text-tweet-purple text-xs sm:text-sm md:text-base font-medium">
                "Just Exploring? While in guest mode, you can generate tweets twice, with two variations each time! and every day!"
              </p>
            )}
            
            <div className="flex flex-col xs:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4 xs:px-0">
              <Button 
                asChild
                size="lg" 
                className="bg-tweet-purple hover:bg-tweet-purple/90 text-white gap-2 px-6 sm:px-8 py-4 sm:py-6 rounded-full text-sm sm:text-base font-medium w-full xs:w-auto min-h-[48px] touch-manipulation"
              >
                <a href="#tweet-generator">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Tweets</span>
                </a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="gap-2 px-6 sm:px-8 py-4 sm:py-6 rounded-full border-tweet-purple text-tweet-purple hover:bg-tweet-purple/10 text-sm sm:text-base font-medium w-full xs:w-auto min-h-[48px] touch-manipulation"
              >
                {user ? (
                  <Link to="/upgrade">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Upgrade</span>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Sign Up</span>
                  </Link>
                )}
              </Button>
            </div>
            
            <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Pro Tips for Better Tweets:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-left max-w-4xl mx-auto">
                <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-tweet-purple mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm leading-relaxed">Be specific with your topic and target audience</p>
                </div>
                <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-tweet-purple mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm leading-relaxed">Include industry terms or trending keywords</p>
                </div>
                <div className="flex gap-2 sm:gap-3 items-start p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors sm:col-span-2 lg:col-span-1">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-tweet-purple mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm leading-relaxed">Add context like "for beginners" or "latest trends"</p>
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
