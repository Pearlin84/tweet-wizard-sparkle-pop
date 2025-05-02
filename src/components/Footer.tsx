
import { Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-16 border-t border-border">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-tweet-purple rounded-full p-1">
            <Twitter className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-tweet-purple">TweetMatters</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Create viral tweets with AI-powered insights. ✨
        </p>
        
        <div className="mt-4 text-xs text-muted-foreground">
          © 2025 TweetMatters. A product of LumeMetrics. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
