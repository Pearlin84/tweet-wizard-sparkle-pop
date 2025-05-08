
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

interface GenerateResponseOptions {
  tweet: string;
  count: number;
  tone: string;
  user_id?: string;
}

export const useGenerateResponse = () => {
  const [responses, setResponses] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const updateUsage = async (userId: string) => {
    try {
      // Get current profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('generations_used, total_allowed_generations, bonus_tweets, bonus_tweets_used')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Track the generation in profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          generations_used: data.generations_used + 1
        })
        .eq('id', userId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error updating usage:', err);
    }
  };

  const generateResponses = async (options: GenerateResponseOptions) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Check if authenticated user has reached daily limit
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('generations_used, total_allowed_generations')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;

        if (data.generations_used >= data.total_allowed_generations) {
          toast({
            title: "Daily limit reached",
            description: "You've reached your daily generation limit.",
            variant: "destructive"
          });
          setIsGenerating(false);
          return;
        }
      }
      
      // Call the Supabase Edge Function to generate responses
      const response = await fetch('https://qrtterltzjdmrxdmnclr.supabase.co/functions/v1/generate-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
        },
        body: JSON.stringify({
          tweet: options.tweet,
          count: options.count,
          tone: options.tone
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate responses');
      }
      
      const data = await response.json();
      
      if (data.success && data.responses) {
        setResponses(data.responses);
        
        // Update usage count for authenticated users
        if (user) {
          await updateUsage(user.id);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating responses');
      toast({
        title: "Generation failed",
        description: err.message || 'Failed to generate responses',
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateResponses,
    responses,
    isGenerating,
    error
  };
};
