import { useState, useEffect } from 'react';
import { snippetsApi, Snippet, PasswordVerificationPayload } from '@/lib/api-client';
import { useSearchParams } from 'next/navigation';

interface UseSnippetResult {
  snippet: Snippet | null;
  isLoading: boolean;
  error: string | null;
  requiresPassword: boolean;
  needsDecryption: boolean;
  verifyPassword: (password: string, action: 'check_password' | 'decrypt') => Promise<boolean>;
}

export function useSnippet(id: string): UseSnippetResult {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [needsDecryption, setNeedsDecryption] = useState(false);
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const verifiedParam = searchParams.get('verified');

  useEffect(() => {
    const fetchSnippet = async () => {
      if (!token) {
        setError("Invalid access token");
        setIsLoading(false);
        return;
      }

      try {
        const data = await snippetsApi.getById(id, token);
        
        if ('requires_password' in data) {
          setRequiresPassword(true);
        } else if ('needs_decryption' in data) {
          setNeedsDecryption(true);
          setSnippet(data);
        } else {
          setSnippet(data);
        }
      } catch (error: any) {
        if (error.response?.status === 403 && error.response?.data?.requires_password) {
          setRequiresPassword(true);
        } else {
          setError("Snippet not found or has expired");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippet();
  }, [id, token, verifiedParam]);

  const verifyPassword = async (password: string, action: 'check_password' | 'decrypt'): Promise<boolean> => {
    try {
      setIsLoading(true);
      const payload: PasswordVerificationPayload = {
        action,
        password
      };
      
      const response = await snippetsApi.verifyPassword(id, payload);
      
      if ('error' in response) {
        setError(response.error);
        return false;
      }
      
      if (action === 'decrypt') {
        setSnippet(response as Snippet);
        setNeedsDecryption(false);
      } else if (response && 'verified' in response && response.verified) {
        // Refetch the snippet with verified flag
        const data = await snippetsApi.getById(id, token as string);
        setSnippet(data);
        setRequiresPassword(false);
        return true;
      }
      
      return 'verified' in response ? !!response.verified : false;
    } catch (error) {
      console.error('Password verification error:', error);
      setError("Password verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { snippet, isLoading, error, requiresPassword, needsDecryption, verifyPassword };
}


