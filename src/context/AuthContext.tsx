
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthError } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  profile: { first_name: string | null; last_name: string | null } | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<{ first_name: string | null; last_name: string | null } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Fetch user profile after sign in
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
          
          // Transfer guest usage data if this is a new sign up
          if (localStorage.getItem('is_signup') === 'true') {
            transferGuestUsage(currentSession.user.id);
            localStorage.removeItem('is_signup');
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const transferGuestUsage = async (userId: string) => {
    try {
      // Get guest usage data from localStorage
      const guestUsage = JSON.parse(localStorage.getItem('guest_usage') || '{"generations": 0, "tweets": 0}');
      
      // Update the user's profile with guest usage and add bonus tweets
      const { error } = await supabase
        .from('profiles')
        .update({
          generations_used: guestUsage.generations,
          bonus_tweets: 10, // Sign-up bonus
          bonus_tweets_used: 0
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Clear guest usage data
      localStorage.removeItem('guest_usage');
      localStorage.removeItem('guest_usage_date');
      
      toast({
        title: "Welcome to TweetMode!",
        description: "You've received 10 bonus tweets as a sign-up gift!",
      });
    } catch (error) {
      console.error('Error transferring guest usage:', error);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fix: Use the correct table name 'profiles' which exists in the Database type
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      navigate('/');
      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Mark this as a signup attempt
      localStorage.setItem('is_signup', 'true');
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) {
        // Clean up signup flag on error
        localStorage.removeItem('is_signup');
        
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Account created",
        description: "Please check your email for verification instructions.",
      });
      return { error: null };
    } catch (error) {
      // Clean up signup flag on error
      localStorage.removeItem('is_signup');
      console.error("Sign up error:", error);
      return { error: error as AuthError };
    }
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for the reset link.",
      });
      return { error: null };
    } catch (error) {
      console.error("Password reset error:", error);
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      navigate('/');
      return { error: null };
    } catch (error) {
      console.error("Password update error:", error);
      return { error: error as AuthError };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading,
      signIn, 
      signUp, 
      signOut, 
      resetPassword,
      updatePassword,
      profile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
