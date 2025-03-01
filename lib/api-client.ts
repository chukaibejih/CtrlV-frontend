import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  // baseURL: process.env.BASE_API_URL || 'https://ctrlv-backend.onrender.com',
  baseURL: process.env.BASE_API_URL || 'http://127.0.0.1:8000',
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
  is_encrypted: boolean;
  version: number;
  versions?: SnippetVersion[];
  requires_password?: boolean;
  needs_decryption?: boolean;
}

export interface SnippetVersion {
  id: string;
  version: number;
  created_at: string;
  language: string;
}

export interface CreateSnippetPayload {
  content: string;
  language: string;
  expiration_minutes?: number;
  one_time_view?: boolean;
  encrypt_content?: boolean;
  password?: string;
  parent_id?: string;
}

export interface CreateSnippetResponse {
  id: string;
  access_token: string;
  sharing_url: string;
  expires_at: string;
  version: number;
}

export interface PasswordVerificationPayload {
  action: 'check_password' | 'decrypt';
  password: string;
}

export interface PasswordVerificationResponse {
  verified?: boolean;
  error?: string;
}

export interface DiffResponse {
  id: string;
  source_snippet: string;
  target_snippet: string;
  diff_content: string;
  created_at: string;
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

  verifyPassword: async (id: string, payload: PasswordVerificationPayload): Promise<Snippet | PasswordVerificationResponse> => {
    const response = await apiClient.post(`/api/v1/snippets/${id}/`, payload);
    return response.data;
  },

  createVersion: async (id: string, payload: CreateSnippetPayload): Promise<CreateSnippetResponse> => {
    const response = await apiClient.post(`/api/v1/snippets/${id}/versions/`, payload);
    return response.data;
  },

  getVersions: async (id: string): Promise<SnippetVersion[]> => {
    const response = await apiClient.get(`/api/v1/snippets/${id}/versions/`);
    return response.data;
  },

  getDiff: async (sourceId: string, targetId: string): Promise<DiffResponse> => {
    const response = await apiClient.get(`/api/v1/snippets/diff/${sourceId}/${targetId}/`);
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/api/v1/snippets/stats/');
    return response.data;
  },
};


