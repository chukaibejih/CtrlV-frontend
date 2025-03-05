import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || 'https://ctrlv-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Snippet {
  id: string;
  content: string;
  language: string;
  created_at: string;
  expires_at: string;
  view_count: number;
  one_time_view: boolean;
}

export interface CreateSnippetPayload {
  content: string;
  language: string;
  expiration?: string;
  one_time_view?: boolean;
}

export interface CreateSnippetResponse {
    id: string;
    access_token: string;
    sharing_url: string;
}

export const snippetsApi = {
    create: async (payload: CreateSnippetPayload): Promise<CreateSnippetResponse> => {
        const response = await apiClient.post('/api/v1/snippets/', payload);
        return response.data;
    },

    getById: async (id: string, token: string): Promise<Snippet> => {
        const response = await apiClient.get(`/api/v1/snippets/${id}/?token=${token}`);
        return response.data;
    },

  getStats: async () => {
    const response = await apiClient.get('/api/v1/snippets/stats/');
    return response.data;
  },
};