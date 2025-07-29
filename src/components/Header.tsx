
import { useState } from 'react';
import { Twitter, User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { user, signOut, profile } = useAuth();
  
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`;
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };
  
  return (
    <header className="w-full py-3 sm:py-4 md:py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex justify-between items-center px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="bg-tweet-purple rounded-full p-1.5 sm:p-2 animate-pulse-light relative">
            <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span className="absolute text-[8px] sm:text-xs font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">X</span>
            <div className="absolute inset-0 bg-tweet-purple rounded-full blur-sm animate-pulse-light -z-10"></div>
          </div>
          <Link to="/" className="touch-manipulation">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-tweet-purple to-tweet-blue bg-clip-text text-transparent">
              TweetMode
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative flex items-center gap-2 sm:gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0 touch-manipulation">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-tweet-purple">
                      <AvatarFallback className="bg-accent text-accent-foreground text-xs sm:text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56 mr-2 sm:mr-0">
                  <div className="p-2 text-center border-b">
                    <p className="text-xs sm:text-sm font-medium">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}` 
                        : `Welcome ${getDisplayName()}!`}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center gap-2 touch-manipulation"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button 
                  variant="outline" 
                  className="rounded-full border-tweet-purple px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 font-medium text-xs sm:text-sm min-h-[36px] sm:min-h-[40px] touch-manipulation"
                  asChild
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button 
                  className="rounded-full bg-tweet-purple hover:bg-tweet-purple/90 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 font-medium text-xs sm:text-sm min-h-[36px] sm:min-h-[40px] touch-manipulation"
                  asChild
                  onClick={() => localStorage.setItem('is_signup', 'true')}
                >
                  <Link to="/auth?tab=signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
