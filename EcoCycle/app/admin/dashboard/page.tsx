// Admin Dashboard Page Component
"use client"
import Footer from '@/components/Footer';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define types
interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
  category: string;
  status: 'active' | 'draft' | 'archived';
}

interface Order {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  lastLogin: string;
}



// console.log("Admin Dashboard component loading");
// useEffect(() => {
//   console.log("Admin Dashboard useEffect running");
//   console.log("Is authenticated:", localStorage.getItem('isAuthenticated'));
//   console.log("User role:", localStorage.getItem('userRole'));
//   console.log("User ID:", localStorage.getItem('userId'));
  
//   // Check if there are any redirect conditions in your authentication logic
//   const checkAdminStatus = async () => {
//     try {
//       console.log("Checking admin status...");
      
//       const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
//       console.log("isAuthenticated check result:", isAuthenticated);
      
//       if (!isAuthenticated) {
//         console.log("Not authenticated, redirecting to login");
//         router.push('/account/login?required=true&returnUrl=/admin/dashboard');
//         return;
//       }
      
//       // Check for admin role
//       const userRole = localStorage.getItem('userRole');
//       console.log("userRole value:", userRole);
      
//       if (userRole !== 'admin') {
//         console.log("Not admin role, would redirect");
//         // Commented out to prevent redirect for debugging
//         // router.push('/products');
//         // return;
//       }
      
//       console.log("Admin check passed, would load dashboard");
//       // Load dashboard data
//       loadDashboardData();
//     } catch (error) {
//       console.error('Error in admin check:', error);
//     }
//   };
  
//   checkAdminStatus();
// }, []);





// Admin Dashboard component
const AdminDashboardPage = () => {
  const router = useRouter();
  
  // Authentication state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dashboard data
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  
  // Check if user is admin
  useEffect(() => {
    // In a real app, you would validate admin status from a secure source
    const checkAdminStatus = async () => {
      try {
        // Simulate API call to verify admin status
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo, assume logged in user is admin
        // In production, you would check JWT token or session
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (!isAuthenticated) {
          router.push('/account/login?required=true&returnUrl=/admin/dashboard');
          return;
        }
        
        // Set admin status (in real app, would come from authentication token)
        setIsAdmin(true);
        
        // Load dashboard data
        loadDashboardData();
      } catch (error) {
        console.error('Error checking admin status', error);
        router.push('/account/login');
      }
    };
    
    checkAdminStatus();
  }, [router]);
  
  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      // Simulate API calls
      await Promise.all([
        // Load mock products
        new Promise<void>(resolve => {
          setTimeout(() => {
            setProducts([
              { id: 'P001', name: 'Eco-Friendly Water Bottle', price: 15.99, inventory: 145, category: 'Kitchen', status: 'active' },
              { id: 'P002', name: 'Bamboo Utensil Set', price: 12.50, inventory: 78, category: 'Kitchen', status: 'active' },
              { id: 'P003', name: 'Reusable Shopping Bag', price: 8.99, inventory: 243, category: 'Bags', status: 'active' },
              { id: 'P004', name: 'Solar-Powered Charger', price: 34.99, inventory: 52, category: 'Electronics', status: 'active' },
              { id: 'P005', name: 'Compostable Phone Case', price: 19.99, inventory: 18, category: 'Accessories', status: 'active' },
              { id: 'P006', name: 'Recycled Notebook', price: 6.99, inventory: 112, category: 'Stationery', status: 'draft' },
              { id: 'P007', name: 'Biodegradable Plant Pots', price: 9.99, inventory: 0, category: 'Garden', status: 'archived' }
            ]);
            resolve();
          }, 300);
        }),
        
        // Load mock orders
        new Promise<void>(resolve => {
          setTimeout(() => {
            setOrders([
              { id: 'ECO-12345678', date: 'May 1, 2025', customer: 'John Doe', total: 35.97, status: 'delivered' },
              { id: 'ECO-87654321', date: 'Apr 30, 2025', customer: 'Jane Smith', total: 15.99, status: 'shipped' },
              { id: 'ECO-11223344', date: 'Apr 29, 2025', customer: 'Alex Johnson', total: 67.45, status: 'processing' },
              { id: 'ECO-55667788', date: 'Apr 28, 2025', customer: 'Sarah Williams', total: 29.99, status: 'processing' },
              { id: 'ECO-99887766', date: 'Apr 27, 2025', customer: 'Robert Brown', total: 54.97, status: 'shipped' }
            ]);
            resolve();
          }, 300);
        }),
        
        // Load mock users
        new Promise<void>(resolve => {
          setTimeout(() => {
            setUsers([
              { id: 'U001', name: 'Admin User', email: 'admin@ecocycle.com', role: 'admin', lastLogin: 'Today, 9:45 AM' },
              { id: 'U002', name: 'John Doe', email: 'john@example.com', role: 'customer', lastLogin: 'May 1, 2025' },
              { id: 'U003', name: 'Jane Smith', email: 'jane@example.com', role: 'customer', lastLogin: 'Apr 30, 2025' },
              { id: 'U004', name: 'Alex Johnson', email: 'alex@example.com', role: 'customer', lastLogin: 'Apr 29, 2025' },
              { id: 'U005', name: 'Sarah Williams', email: 'sarah@example.com', role: 'customer', lastLogin: 'Apr 25, 2025' }
            ]);
            resolve();
          }, 300);
        }),
        
        // Load mock stats
        new Promise<void>(resolve => {
          setTimeout(() => {
            setStats({
              totalSales: 10542.97,
              totalOrders: 143,
              totalProducts: 24,
              totalUsers: 87,
              pendingOrders: 12,
              lowStockProducts: 3
            });
            resolve();
          }, 300);
        })
      ]);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data', error);
    }
  };
  
  // Handle tab change
  const handleTabChange = (tab: 'overview' | 'products' | 'orders' | 'users') => {
    setActiveTab(tab);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  
  // If still checking admin status or loading data
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If not admin, redirect (should not reach this point due to useEffect)
  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Access Denied</div>
            <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Admin Dashboard - EcoCycle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-100">
        
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your EcoCycle store</p>
            </div>
            
            {/* Dashboard Navigation */}
            <div className="bg-white shadow-sm rounded-lg mb-6">
              <nav className="flex border-b border-gray-200">
                <button
                  onClick={() => handleTabChange('overview')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-emerald-500 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleTabChange('products')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'products'
                      ? 'border-b-2 border-emerald-500 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => handleTabChange('orders')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'orders'
                      ? 'border-b-2 border-emerald-500 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => handleTabChange('users')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'users'
                      ? 'border-b-2 border-emerald-500 text-emerald-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Users
                </button>
              </nav>
            </div>
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Total Sales Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-md bg-emerald-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
                        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalSales)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Orders Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Users Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-md bg-purple-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                        <p className="text-2xl font-bold text-purple-600">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Stats Rows */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Recent Orders */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                      <button
                        onClick={() => handleTabChange('orders')}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map(order => (
                        <div key={order.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <div>
                            <p className="font-medium text-gray-800">{order.customer}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' : 
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                'bg-red-100 text-red-800'}`
                            }>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <span className="ml-4 font-medium">{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Low Stock Products */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Low Stock Products</h3>
                      <button
                        onClick={() => handleTabChange('products')}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {products
                        .filter(product => product.inventory < 20 && product.status === 'active')
                        .slice(0, 3)
                        .map(product => (
                          <div key={product.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <div>
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${product.inventory === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`
                              }>
                                {product.inventory === 0 ? 'Out of Stock' : `${product.inventory} left`}
                              </span>
                              <span className="ml-4 font-medium">{formatCurrency(product.price)}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Products</h2>
                  <button
                    onClick={() => alert('Add product functionality would go here')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Product
                  </button>
                </div>
                
                <div className="bg-white shadow-sm overflow-hidden sm:rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inventory
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.inventory}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                                product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'}`
                            }>
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => alert(`Edit ${product.name}`)}
                              className="text-emerald-600 hover:text-emerald-900 mr-3"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => alert(`Delete ${product.name}`)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Orders</h2>
                </div>
                
                <div className="bg-white shadow-sm overflow-hidden sm:rounded-md">
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
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.customer}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(order.total)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' : 
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                'bg-red-100 text-red-800'}`
                            }>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => alert(`View order ${order.id}`)}
                              className="text-emerald-600 hover:text-emerald-900 mr-3"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => alert(`Update status for order ${order.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Users</h2>
                  <button
                    onClick={() => alert('Add user functionality would go here')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add User
                  </button>
                </div>
                
                <div className="bg-white shadow-sm overflow-hidden sm:rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-medium">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`
                            }>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.lastLogin}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => alert(`Edit ${user.name}`)}
                              className="text-emerald-600 hover:text-emerald-900 mr-3"
                            >
                              Edit
                            </button>
                            {user.role !== 'admin' && (
                              <button 
                                onClick={() => alert(`Delete ${user.name}`)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AdminDashboardPage;