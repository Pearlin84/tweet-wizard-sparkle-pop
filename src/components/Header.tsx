
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
  
  return (
    <header className="w-full py-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-tweet-purple rounded-full p-2 animate-pulse-light relative">
            <Twitter className="w-5 h-5 text-white" />
            <span className="absolute text-xs font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">X</span>
            <div className="absolute inset-0 bg-tweet-purple rounded-full blur-sm animate-pulse-light -z-10"></div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-tweet-purple to-tweet-blue bg-clip-text text-transparent">
            TweetMode
          </h1>
        </div>
        
        <div className="relative flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0">
                  <Avatar className="h-10 w-10 border-2 border-tweet-purple">
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2 text-center border-b">
                  <p className="text-sm font-medium">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}` 
                      : user.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center gap-2"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              className="rounded-full border-tweet-purple px-6 py-2 font-medium"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              asChild
            >
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
          
          {showTooltip && !user && (
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-card px-4 py-2 rounded-lg shadow-lg border border-border animate-fade-in z-10">
              <span className="text-sm">Create an account!</span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-card border-b border-r border-border rotate-45"></div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
