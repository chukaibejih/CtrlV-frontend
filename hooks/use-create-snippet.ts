import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { snippetsApi, CreateSnippetPayload } from '@/lib/api-client';
import { ShareOptions } from '@/components/ui/ShareModal';

export function useCreateSnippet() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createSnippet = async (content: string, language: string, options: ShareOptions) => {
    setIsLoading(true);
    try {
      const payload: CreateSnippetPayload = {
        content,
        language,
        expiration_minutes: options.expirationMinutes,
        one_time_view: options.oneTimeView,
        encrypt_content: options.isEncrypted,
        password: options.password || undefined,
      };

      // If it's a new version, add the parent ID
      if (options.isNewVersion && options.parentId) {
        payload.parent_id = options.parentId;
      }

      console.log('Sending payload to API:', { 
        ...payload, 
        password: payload.password ? '[REDACTED]' : undefined 
      });
      
      // Use the correct endpoint based on whether it's a new version
      let response;
      if (options.isNewVersion && options.parentId) {
        response = await snippetsApi.createVersion(options.parentId, payload);
      } else {
        response = await snippetsApi.create(payload);
      }
      
      console.log('API response:', { 
        ...response, 
        access_token: '[REDACTED]' 
      });

      // Return the response
      return response;
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


