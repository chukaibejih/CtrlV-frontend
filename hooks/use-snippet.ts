import { useState, useEffect } from 'react';
import { snippetsApi, Snippet } from '@/lib/api-client';

interface UseSnippetResult {
  snippet: Snippet | null;
  isLoading: boolean;
  error: string | null;
}

export function useSnippet(id: string): UseSnippetResult {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the token from URL parameters directly on the client
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    const fetchSnippet = async () => {
      if (!token) {
        setError("Invalid access token");
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await snippetsApi.getById(id, token);
        setSnippet(data);
      } catch (error) {
        setError("Snippet not found or has expired");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSnippet();
  }, [id]);
  
  return { snippet, isLoading, error };
}