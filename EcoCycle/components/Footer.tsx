// components/Footer.tsx
import React from 'react';
import Link from 'next/link';

// Footer Component
const Footer = () => {
    return (
        <footer className="bg-white text-gray-800 shadow-md py-6 border-t border-gray-200">
            <div className="container mx-auto text-center">
                <Link href="/contact" className="hover:text-emerald-500 transition-colors whitespace-nowrap">Contact Us</Link>
            </div>
        </footer>
    );
};

export default Footer;