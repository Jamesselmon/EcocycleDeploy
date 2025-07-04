"use client"
import Footer from '@/components/Footer';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Define the item interface
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface OrderSummary {
  customer_email: string;
  orderId: string;
  orderDate: string;
  items: OrderItem[]; // Using the OrderItem interface here
  shipping: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  payment: {
    method: string;
    last4?: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  estimatedDelivery: string;
}

// Helper function to fix image URLs
const fixImageUrl = (url: string | undefined): string => {
  if (!url) return '/images/placeholder.svg';
  
  // If it's an absolute URL with http/https, use it directly
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's already in the /images/ format, use it directly
  if (url.startsWith('/images/')) {
    return url;
  }
  
  // If it's a media URL from Django, convert to images directory
  if (url.startsWith('/media/')) {
    // Extract the filename from the path
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return `/images/${filename}`;
  }
  
  // For other relative paths, add /images/ prefix if they have an image extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
  for (const ext of imageExtensions) {
    if (url.toLowerCase().endsWith(ext)) {
      // If it's just a filename without a path, add /images/ prefix
      if (!url.includes('/')) {
        return `/images/${url}`;
      }
    }
  }
  
  // If all else fails, try using the URL directly
  return url;
};

// Component that handles the search params and content
const OrderContent = () => {
  const [orderDetails, setOrderDetails] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugUrls, setDebugUrls] = useState<{original: string, fixed: string}[]>([]);
  
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Missing orderId in URL.");
      return;
    }

    // Use the backend URL from environment in production
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ecocycle-backend-xoli.onrender.com';
    const requestUrl = `${apiBaseUrl}/order/${orderId}/confirmation/`;
    
    console.log('Fetching order confirmation from:', requestUrl);
    
    fetch(requestUrl)
      .then(res => {
        if (!res.ok) {
          console.error('Error status:', res.status);
          throw new Error(`Failed to load order: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Log the raw response
        console.log("Raw order confirmation data:", data);
        
        // Process the items to ensure image URLs are correct
        if (data.items && data.items.length > 0) {
          const urlDebugInfo: {original: string, fixed: string}[] = [];
          
          // Process the data with fixed image URLs
          const processedData = {
            ...data,
            items: data.items.map((item: any) => {
              // Original imageUrl from the API
              const originalUrl = item.imageUrl || '';
              console.log(`Original image URL for ${item.name}: ${originalUrl}`);
              
              // Apply our image URL fixing function
              const fixedUrl = fixImageUrl(originalUrl);
              console.log(`Fixed image URL for ${item.name}: ${fixedUrl}`);
              
              // Store for debugging
              urlDebugInfo.push({original: originalUrl, fixed: fixedUrl});
              
              return {
                ...item,
                imageUrl: fixedUrl
              };
            })
          };
          
          setOrderDetails(processedData);
          setDebugUrls(urlDebugInfo);
        } else {
          setOrderDetails(data);
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading order confirmation:", err);
        setLoading(false);
        setError(`Failed to load order details: ${err.message}`);
      });
  }, [orderId]);

  const toggleDebugInfo = () => {
    const debugElement = document.getElementById('image-debug-info');
    if (debugElement) {
      debugElement.style.display = debugElement.style.display === 'none' ? 'block' : 'none';
    }
  };

  if (loading) {
    return (
      <div className="text-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing your order...</p>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="text-center p-12">
        <p className="text-red-500 mb-4">{error || "Unable to retrieve order details."}</p>
        <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You For Your Order!</h1>
        <p className="text-gray-600">Your order has been received and is now being processed.</p>
        <p className="text-gray-600">
          We&apos;ve sent a confirmation email to <span className="font-medium">{orderDetails.customer_email}</span>
        </p>
        {/* <button
          onClick={toggleDebugInfo}
          className="mt-2 text-xs text-gray-500 underline"
        >
          Debug Images
        </button> */}
      </div>

      {/* Debug Information (hidden by default) */}
      <div id="image-debug-info" className="bg-gray-100 p-4 rounded-lg mb-6 text-xs font-mono overflow-auto" style={{ display: 'none', maxHeight: '200px' }}>
        <h4 className="font-bold mb-2">Image URL Transformations:</h4>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-1 border">Item</th>
              <th className="p-1 border">Original URL</th>
              <th className="p-1 border">Fixed URL</th>
            </tr>
          </thead>
          <tbody>
            {debugUrls.map((item, index) => (
              <tr key={index}>
                <td className="p-1 border">{index + 1}</td>
                <td className="p-1 border">{item.original || 'none'}</td>
                <td className="p-1 border">{item.fixed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 bg-emerald-50 border-b border-emerald-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Order ECO - {orderDetails.orderId}</h2>
              <p className="text-sm text-gray-600">Placed on {orderDetails.orderDate}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
                Order Confirmed
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Order Summary */}
            <div className="flex-1 mb-6 md:mb-0">
              <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-4">
                {orderDetails.items.map(item => (
                  <div key={item.id} className="flex items-start">
                    <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                      {/* Image with better error handling and logging */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.error(`Failed to load image: ${item.imageUrl}`);
                          e.currentTarget.src = '/images/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{(item.price * item.quantity).toFixed(2)} ฿ </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">{orderDetails.subtotal.toFixed(2)} ฿</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">{orderDetails.shippingCost.toFixed(2)} ฿</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">{orderDetails.tax.toFixed(2)} ฿</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-gray-800">Total</span>
                  <span className="text-emerald-600">{orderDetails.total.toFixed(2)} ฿</span>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Shipping Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-800">{orderDetails.shipping.name}</p>
                  <p className="text-gray-600">{orderDetails.shipping.address}</p>
                  <p className="text-gray-600">
                    {orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.postalCode}
                  </p>
                  <p className="text-gray-600">{orderDetails.shipping.country}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Payment Method</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="flex items-center text-gray-800">
                    {orderDetails.payment.method.toLowerCase() === 'paypal' ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.494a.64.64 0 0 1 .632-.543h6.964c2.075 0 3.747.517 4.757 1.501.957.945 1.222 2.089.82 3.854-.08.357-.218.732-.393 1.108a.637.637 0 0 1-.13.207l.018-.013c1.071 1.156 1.515 2.498 1.317 4.016-.22 1.687-.937 3.103-2.14 4.215-1.219 1.13-2.892 1.689-5.096 1.689H8.55l-.262 1.69a.638.638 0 0 1-.63.536H7.076v.01z" />
                        </svg>
                        PayPal
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4zm0 2h16v2H4V6zm0 4h16v8H4v-8z" />
                        </svg>
                        Credit Card {orderDetails.payment.last4 ? `(**** **** **** ${orderDetails.payment.last4})` : ''}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-4">Estimated Delivery</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{orderDetails.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
        <Link
          href="/products"
          className="bg-white text-emerald-600 font-medium py-3 px-6 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors duration-200 text-center"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-center"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
};

// Main component that wraps content with Suspense
const OrderConfirmationPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order information...</p>
            </div>
          </div>
        }>
          <OrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;