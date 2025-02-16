import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { snippetsApi, CreateSnippetPayload } from '@/lib/api-client';

export function useCreateSnippet() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createSnippet = async (payload: CreateSnippetPayload) => {
    setIsLoading(true);
    try {
      console.log('Sending payload to API:', payload);
      const response = await snippetsApi.create(payload);
      console.log('Raw API response:', response);

      // Construct and log the sharing URL
      const shareUrl = `${window.location.origin}/s/${response.id}?token=${response.access_token}`;
      console.log('Constructed share URL:', shareUrl);
      
      return {
        ...response,
        sharing_url: shareUrl
      };
    } catch (error) {
      console.error('API error:', error);
      toast({
        title: "Failed to share",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createSnippet, isLoading };
}
