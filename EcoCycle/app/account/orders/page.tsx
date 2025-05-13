"use client"
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Order interface that matches your Django API response format
interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
  trackingNumber?: string;
  deliveryEstimate?: string;
}

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      let debugLog = "Debug info:\n";
      
      try {
        // Get token and userId from localStorage
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        debugLog += `Token found: ${token ? 'Yes' : 'No'}\n`;
        debugLog += `UserId found: ${userId ? 'Yes' : 'No'}\n`;
        
        if (!token) {
          console.error("No token found in localStorage");
          setAuthError("You need to log in to view your orders");
          setIsLoading(false);
          return;
        }

        // Use the correct API URL from your environment and urls.py
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ecocycle-backend-xoli.onrender.com';
        
        // Based on your urls.py, the endpoint is just '/orders/'
        const requestUrl = `${baseUrl}/orders/`;
        
        debugLog += `Fetching orders from: ${requestUrl}\n`;
        
        // Make the request with the token in the Authorization header
        const res = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`  // Django REST typically uses Token auth
          },
        });

        debugLog += `Response status: ${res.status}\n`;
        
        // Handle authentication errors
        if (res.status === 401 || res.status === 403) {
          setAuthError("Your session has expired. Please log in again.");
          setIsLoading(false);
          return;
        }
        
        // Get the response text for debugging
        const responseText = await res.text();
        debugLog += `Raw response (truncated): ${responseText.substring(0, 200)}...\n`;

        // Check for empty response
        if (!responseText) {
          console.error('Empty response received');
          throw new Error('Empty response from server');
        }

        // Parse JSON response
        let data;
        try {
          data = JSON.parse(responseText);
          debugLog += `Successfully parsed JSON response\n`;
        } catch (parseError) {
          debugLog += `Error parsing response as JSON: ${parseError}\n`;
          throw new Error('Failed to parse response as JSON');
        }

        // Get orders from the response based on your API structure
        let ordersArray: Order[] = [];
        
        if (data.orders && Array.isArray(data.orders)) {
          // This matches your Django API which returns {"orders": results}
          debugLog += `Found orders array in data.orders with ${data.orders.length} orders\n`;
          ordersArray = data.orders;
        } else if (Array.isArray(data)) {
          // Fallback if the response is a direct array
          debugLog += `Response is a direct array with ${data.length} orders\n`;
          ordersArray = data;
        } else {
          debugLog += `Could not find orders array in response\n`;
          debugLog += `Response keys: ${Object.keys(data).join(', ')}\n`;
        }
        
        setOrders(ordersArray);
        debugLog += `Final orders count: ${ordersArray.length}\n`;
      } catch (error) {
        console.error('Error fetching orders:', error);
        debugLog += `Error: ${error}\n`;
        
        if (!authError) {
          setAuthError("Could not load your orders. Please try again later.");
        }
      } finally {
        setIsLoading(false);
        setDebugInfo(debugLog);
      }
    };
  
    fetchOrders();
  }, []);
  
  // Function to get status badge color based on order status
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ฿`;
  };
  
  // View order details
  const viewOrderDetails = (orderId: string) => {
    router.push(`/account/orders/${orderId}`);
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  // Show/hide debug info
  const toggleDebugInfo = () => {
    const debugElement = document.getElementById('debug-info');
    if (debugElement) {
      debugElement.style.display = debugElement.style.display === 'none' ? 'block' : 'none';
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">My Orders</h1>
              <p className="text-gray-600">View and track all your EcoCycle orders</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors duration-200"
              >
                Continue Shopping
              </Link>
              {authError && (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  Log In Again
                </button>
              )}
              {/* <button
                onClick={toggleDebugInfo}
                className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Debug
              </button> */}
            </div>
          </div>
          
          {/* Debug Information (hidden by default) */}
          <div id="debug-info" className="bg-gray-100 p-4 rounded-lg mb-6 text-xs font-mono overflow-auto" style={{ display: 'none', maxHeight: '200px' }}>
            <pre>{debugInfo}</pre>
          </div>
          
          {authError ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Error</h3>
              <p className="text-gray-600 mb-6">
                {authError}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
              >
                Go to Login
              </Link>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ECO - {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.items}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => viewOrderDetails(order.id)}
                            className="text-emerald-600 hover:text-emerald-900 transition-colors duration-200"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;