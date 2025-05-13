// api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Modify fetchWithAuth in your api.ts file
export async function fetchWithAuth(endpoint: string, options = {}) {
  // Get token from localStorage only on client side
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }
  
  // Log for debugging
  console.log(`Calling ${endpoint} with token: ${token ? 'present' : 'missing'}`);
  
  const defaultOptions = {
    headers: {
      'Authorization': token ? `Token ${token}` : '',
      'Content-Type': 'application/json',
    },
    ...options
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.error || error.message || `API error: ${response.status}`);
      } catch (e) {
        throw new Error(`API error: ${response.status} - ${errorText.slice(0, 100)}`);
      }
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
}

// Admin dashboard API calls
export const adminAPI = {
  getStats: () => fetchWithAuth('/api/admin/stats/'),
  getProducts: () => fetchWithAuth('/api/admin/products/'),
  getOrders: () => fetchWithAuth('/api/admin/orders/'),
  getUsers: () => fetchWithAuth('/api/admin/users/'),
};