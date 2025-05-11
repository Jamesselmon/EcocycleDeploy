// api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function for API calls with authentication
export async function fetchWithAuth(endpoint: string, options = {}) {
  // Get token from localStorage only on client side
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }
  
  const defaultOptions = {
    headers: {
      'Authorization': token ? `Token ${token}` : '',
      'Content-Type': 'application/json',
    },
    ...options
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }
  
  return response.json();
}

// Admin dashboard API calls
export const adminAPI = {
  getStats: () => fetchWithAuth('/api/admin/stats/'),
  getProducts: () => fetchWithAuth('/api/admin/products/'),
  getOrders: () => fetchWithAuth('/api/admin/orders/'),
  getUsers: () => fetchWithAuth('/api/admin/users/'),
};