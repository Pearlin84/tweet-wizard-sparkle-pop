
import { Twitter } from 'lucide-react';

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 hero-gradient">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block bg-accent p-2 px-4 rounded-full mb-4 animate-bounce-light">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Twitter className="w-4 h-4 text-tweet-purple" />
            <span>AI Powered Tweet Generator</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
          Create <span className="bg-gradient-to-r from-tweet-pink via-tweet-purple to-tweet-blue bg-clip-text text-transparent">viral tweets</span> for any topic in seconds
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Simply enter your topic and our AI will generate engaging, shareable tweets that will help you grow your audience and increase engagement.
        </p>
        
        <div className="space-y-3 max-w-xl mx-auto">
          <div className="flex items-start gap-2 text-sm">
            <div className="bg-tweet-purple/20 rounded-full p-1 mt-0.5">
              <div className="w-3 h-3 bg-tweet-purple rounded-full"></div>
            </div>
            <p className="text-left">Web analysis ensures your tweets reflect current trends and conversations</p>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <div className="bg-tweet-blue/20 rounded-full p-1 mt-0.5">
              <div className="w-3 h-3 bg-tweet-blue rounded-full"></div>
            </div>
            <p className="text-left">AI-powered algorithm crafts tweets optimized for engagement and virality</p>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <div className="bg-tweet-pink/20 rounded-full p-1 mt-0.5">
              <div className="w-3 h-3 bg-tweet-pink rounded-full"></div>
            </div>
            <p className="text-left">Multiple options give you variety to choose the perfect tweet for your audience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
