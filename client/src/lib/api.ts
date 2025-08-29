// client/src/lib/api.ts
import { hc } from 'hono/client';
import type { AppType } from '../../../server/src/index';

// Create API client with authentication support
function createApiClient() {
  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return hc<AppType>('http://localhost:3000/api', {
    headers: getAuthHeaders
  });
}

// Create the client instance
const client = createApiClient();

// Export API with auth-aware methods
export const api = {
  ...client,
  // Auth endpoints (no auth required for login/register)
  auth: {
    login: client.auth.login,
    register: client.auth.register
  },
  // Override methods that need authentication
  tweets: {
    ...client.tweets,
    $get: () => {
      const token = localStorage.getItem('auth_token');
      return client.tweets.$get({
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
    },
    $post: (args: any) => {
      const token = localStorage.getItem('auth_token');
      return client.tweets.$post({
        ...args,
        headers: {
          ...args?.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
    }
  }
};