import { useState, useEffect } from 'react';
import { snippetsApi, Snippet } from '@/lib/api-client';
import { useSearchParams } from 'next/navigation';

interface UseSnippetResult {
  snippet: Snippet | null;
  isLoading: boolean;
  error: string | null;
}

export function useSnippet(id: string): UseSnippetResult {
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
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
    }, [id, token]);

    return { snippet, isLoading, error };
}