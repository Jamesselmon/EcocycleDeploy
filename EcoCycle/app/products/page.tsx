"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Head from 'next/head';

type Product = {
    id: number;
    name: string;
    price: number;
    image?: string;
    category: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Updated ProductCard component with debugging
const ProductCard = ({ id, name, price, image, category }: Product) => {
    const router = useRouter();
    
    // Since images are in the public directory, use the path directly or fallback to placeholder
    const imagePath = image || '/images/placeholder.svg';
    
    // Log for debugging
    console.log(`Product ${id} - ${name}: Using image path: ${imagePath}`);

    return (
        <div
            className="bg-white rounded-lg shadow p-4 cursor-pointer"
            onClick={() => router.push(`/products/${id}`)}
        >
            <div className="h-48 flex justify-center items-center border-b mb-4 overflow-hidden">
                {/* Use Next.js Image component since images are local */}
                <img 
                    src={imagePath}
                    alt={name || 'Product Image'}
                    className="object-cover h-full w-full"
                    onError={(e) => {
                        console.error(`Failed to load image: ${imagePath}`);
                        e.currentTarget.src = '/images/placeholder.svg';
                    }}
                />
            </div>
            <h2 className="text-lg font-semibold text-emerald-700">{name}</h2>
            <p className="text-emerald-700 font-bold">฿{`${parseFloat(price.toString()).toFixed(2)}`}</p>
            <p className="text-sm text-gray-600">Category: {category}</p>
        </div>
    );
};

const ProductGrid = ({ products }: { products: Product[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
            <ProductCard key={product.id} {...product} />
        ))}
    </div>
);

const ProductPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiResponse, setApiResponse] = useState<any>(null);

    useEffect(() => {
        if (!API_BASE_URL) {
            console.error("API Base URL is not defined. Check NEXT_PUBLIC_API_URL environment variable.");
            setError("Configuration error: API URL missing.");
            setLoading(false);
            return;
        }

        const apiUrl = `${API_BASE_URL}/products/`;
        console.log(`Fetching products from: ${apiUrl}`);

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                // Store raw API response for debugging
                setApiResponse(data);
                
                if (!Array.isArray(data)) {
                    console.error('API did not return an array:', data);
                    throw new Error('Invalid data format received from API.');
                }
                
                // Debug information
                console.log("Products received from API:", data.length);
                data.forEach((product, index) => {
                    console.log(`Product ${index+1}: ID=${product.id}, Name=${product.name}`);
                    console.log(`  Image: ${product.image}`);
                });
                
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load products:', err);
                setError(`Failed to load products: ${err.message}`);
                setLoading(false);
            });
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
       return (
         <div className="flex flex-col min-h-screen bg-gray-100 font-[Playfair Display]">
             <Header />
             <main className="flex-grow flex items-center justify-center">
                 <p>Loading products...</p>
             </main>
             <Footer />
         </div>
       );
    }

    if (error) {
      return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-[Playfair Display]">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    
                    {/* Debug info */}
                    <div className="mt-4 p-3 bg-gray-100 rounded text-xs overflow-auto">
                        <p className="font-bold">API URL:</p>
                        <p>{API_BASE_URL}/products/</p>
                        
                        <p className="font-bold mt-2">API Response:</p>
                        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
      );
    }

    return (
        <>
            <Head>
                <title>EcoCycle - Products</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />
            </Head>

            <div className="flex flex-col min-h-screen bg-gray-100 font-[Playfair Display]">
            <Header />
                <main className="flex-grow">
                    <section className="container mx-auto py-10">
                        <div className="mb-10 flex justify-center items-center gap-3">
                            <input
                                type="text"
                                placeholder="Search eco-friendly products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-[350px] px-5 py-3 rounded-2xl bg-white shadow-md border border-gray-200 text-gray-700 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
                            />
                            <button
                                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500"
                            >
                                Search
                            </button>
                        </div>

                        {/* Debug info */}
                        <div className="mb-4 p-3 bg-gray-100 rounded">
                            <p className="text-sm font-bold">API Response Summary:</p>
                            <p className="text-xs">Products loaded: {products.length}</p>
                            <p className="text-xs">API Base URL: {API_BASE_URL}</p>
                        </div>

                        <ProductGrid products={filteredProducts} />
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default ProductPage;