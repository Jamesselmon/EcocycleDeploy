// /frontend/app/products/[id]/page.tsx
// (Or wherever your file for the product detail page route is located)

"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { useParams, useRouter } from 'next/navigation'; // Correct hooks for App Router

type Product = {
  id: number;
  name: string;
  description: string;
  price: number | string; // Keep flexibility if API sometimes returns string
  stock: number;
  image?: string; // Image path from API (e.g., /media/products/...)
};

// Get the base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Changed variable name for clarity

const ProductDetailPage = () => {
  const params = useParams(); // Hook to get route parameters
  const id = params?.id; // Get the 'id' parameter from the URL (e.g., '123')

  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Get user ID from local storage when component mounts
  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      try {
        setUserId(parseInt(storedId, 10)); // Use radix 10
      } catch (e) {
        console.error("Failed to parse stored userId:", e);
        localStorage.removeItem('userId'); // Clear invalid ID
      }
    }
  }, []);

  // Fetch product details when 'id' changes
  useEffect(() => {
    // Don't fetch if id is missing or API URL is not configured
    if (!id || !API_BASE_URL) {
      if (!id) setError("Product ID missing from URL.");
      if (!API_BASE_URL) setError("API URL is not configured. Check environment variables.");
      setLoading(false);
      return;
    }

    setLoading(true); // Set loading true when starting fetch
    const productDetailUrl = `${API_BASE_URL}/products/${id}/`; // CONSTRUCTED URL
    console.log(`Fetching product detail from: ${productDetailUrl}`);

    fetch(productDetailUrl) // USE CONSTRUCTED URL
      .then(res => {
        if (!res.ok) {
           // Try to get more specific error from backend response
          return res.json().then(errData => {
             throw new Error(errData.error || `HTTP error! status: ${res.status}`);
          }).catch(() => {
             // Fallback if response is not JSON
             throw new Error(`HTTP error! status: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data: Product) => { // Add type annotation for fetched data
        setProduct(data);
        setError(null); // Clear previous errors on success
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(`Failed to load product: ${err.message}`);
      })
      .finally(() => {
        setLoading(false); // Ensure loading is set to false whether success or error
      });

  }, [id]); // Dependency array includes 'id'

  // --- Quantity Change Handler ---
  const handleQuantityChange = (value: number) => {
    if (product && value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  // --- Add to Cart Handler ---
  const handleAddToCart = () => {
    if (!userId) {
      alert('Please log in before adding items to your cart.');
      // Optionally redirect to login: router.push('/login');
      return;
    }
     // Ensure API URL is available
    if (!API_BASE_URL) {
       alert("Cannot add to cart: API URL is not configured.");
       return;
    }

    if (product) {
      const cartItem = {
        user_id: userId,
        product_id: product.id,
        quantity,
      };

      const addToCartUrl = `${API_BASE_URL}/add-to-cart/`; // CONSTRUCTED URL
      console.log(`Adding to cart at: ${addToCartUrl}`);

      fetch(addToCartUrl, { // USE CONSTRUCTED URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItem),
      })
        .then(async res => {
           // Always try to parse JSON, even for errors, as backend might send error details
           const data = await res.json().catch(() => ({})); // Handle cases where response is not JSON
           if (!res.ok) {
               // Use error from backend response if available, otherwise provide generic message
               throw new Error(data.error || `Failed to add to cart (Status: ${res.status})`);
           }
           return data; // Return data on success
        })
        .then((data) => {
          console.log("Add to cart successful:", data);
          alert('Item added to cart successfully!'); // Give feedback
          // Consider updating cart state locally or redirecting
          // router.push('/cart'); // Example redirect
        })
        .catch(err => {
          console.error("Error adding to cart:", err);
          // Display the specific error message from the backend/fetch
          alert(`Something went wrong: ${err.message}`);
        });
    }
  };

  // --- Render Logic ---
  if (loading) return (
     <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow flex items-center justify-center">Loading product details...</main>
        <Footer />
     </div>
  );

  if (error) return (
      <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <main className="flex-grow flex items-center justify-center text-red-600">Error: {error}</main>
          <Footer />
      </div>
  );

  if (!product) return (
     <div className="flex flex-col min-h-screen bg-gray-100">
         <Header />
         <main className="flex-grow flex items-center justify-center">Product not found.</main>
         <Footer />
     </div>
  );

  // Format price safely after confirming product exists
  const formattedPrice = typeof product.price === 'number'
    ? product.price.toFixed(2)
    : parseFloat(String(product.price)).toFixed(2);

  // Construct image URL safely
  const imageUrl = product.image && API_BASE_URL ? `${API_BASE_URL}${product.image}` : '@/public/images/placeholder.svg'; // Provide a fallback placeholder image path

  return (
    <>
      <Head>
        <title>{product.name} - EcoCycle</title>
        <meta name="description" content={product.description.substring(0, 150)} /> {/* Add meta description */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-100 font-[Playfair Display]"> {/* Ensure font is applied */}
        <Header />
        <main className="flex-grow">
          <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-lg"> {/* Added container style */}
              {/* Image Section */}
              <div className="h-64 sm:h-80 md:h-96 flex justify-center items-center overflow-hidden rounded-lg border">
                <img
                    src={imageUrl} // USE CONSTRUCTED URL
                    alt={product.name}
                    className="max-h-full object-contain"
                    onError={(e) => {
                       // Handle image loading errors, e.g., show placeholder
                       e.currentTarget.src = '/placeholder.png'; // Make sure you have this image in your public folder
                       e.currentTarget.alt = 'Image unavailable';
                    }}
                />
              </div>

              {/* Details Section */}
              <div className="px-2 flex flex-col justify-center"> {/* Aligned content */}
                <h1 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-3">{product.name}</h1>
                <p className="text-lg sm:text-xl font-semibold text-emerald-600 mb-4">฿{formattedPrice}</p>
                <p className="text-base text-gray-700 mb-5">{product.description}</p>
                <p className="text-base text-gray-600 mb-6">Available Stock: <span className="font-semibold">{product.stock}</span></p>

                {/* Actions Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                   {/* Quantity Selector */}
                  <div className="flex items-center border rounded">
                    <button
                      className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >-</button>
                    <span className="px-3 sm:px-4 py-2 bg-white text-center min-w-[40px] sm:min-w-[50px] text-gray-700 border-l border-r">{quantity}</span>
                    <button
                      className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock || product.stock <= 0} // Also disable if stock is 0
                      aria-label="Increase quantity"
                    >+</button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    onClick={handleAddToCart}
                    disabled={quantity <= 0 || product.stock <= 0} // Disable if stock is 0
                  >
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
                 {product.stock > 0 && quantity >= product.stock && (
                    <p className="text-red-500 text-sm mt-2">Maximum stock reached.</p>
                 )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;