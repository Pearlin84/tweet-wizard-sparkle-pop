
import PostQuillLogo from "@/components/PostQuillLogo";
import { Link } from "react-router-dom";

const Header = () => {
  
  return (
    <header className="w-full py-3 sm:py-4 md:py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex justify-between items-center px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <PostQuillLogo size="md" className="animate-pulse-light" />
          <Link to="/" className="touch-manipulation">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              PostQuill
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-center">
            <p className="text-sm sm:text-base font-medium bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Hi there! 👋
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ready to create amazing content?
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
