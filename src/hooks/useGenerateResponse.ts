
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface GenerateResponseParams {
  tweet: string;
  tone: string;
  count: number;
  user_id?: string;
}

export const useGenerateResponse = () => {
  const [responses, setResponses] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponses = async (params: GenerateResponseParams) => {
    setIsGenerating(true);
    setError(null);

    try {
      const { tweet, tone, count, user_id } = params;
      
      // Call the Supabase Edge Function for generating responses
      const { data, error } = await supabase.functions.invoke('generate-responses', {
        body: { tweet, tone, count, user_id },
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate responses');
      }

      if (data?.responses && Array.isArray(data.responses)) {
        setResponses(data.responses);
      } else {
        throw new Error('Invalid response format from API');
      }

    } catch (err) {
      console.error('Error generating responses:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to generate responses',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const clearResponses = () => {
    setResponses([]);
    setError(null);
  };

  return {
    generateResponses,
    clearResponses,
    responses,
    isGenerating,
    error,
  };
};
