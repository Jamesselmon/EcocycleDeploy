"use client";
import { useEffect, useState } from 'react';

export default function ImageChecker() {
    const [images, setImages] = useState([
        '/images/placeholder.svg',
        '/images/PD01.jpg',
        '/images/PD02.jpg',
        '/images/PD03.jpg',
        '/images/PD04.jpg',
        '/images/PD05.jpg',
        '/images/PD06.jpg',
        '/images/PD07.jpg',
        '/images/PD08.jpg',
        '/images/PD09.jpg',
        '/images/PD10.jpg',
        '/images/PD11.jpg',
        '/images/PD12.jpg',
    ]);
    
    const [imageStatus, setImageStatus] = useState({});
    
    const checkImage = (path) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ path, status: 'loaded' });
            img.onerror = () => resolve({ path, status: 'failed' });
            img.src = path;
        });
    };
    
    useEffect(() => {
        const checkAllImages = async () => {
            const results = await Promise.all(images.map(checkImage));
            const statusObj = {};
            results.forEach(result => {
                statusObj[result.path] = result.status;
            });
            setImageStatus(statusObj);
        };
        
        checkAllImages();
    }, [images]);
    
    return (
        <div style={{ padding: '20px' }}>
            <h1>Image Availability Checker</h1>
            <p>This page checks if images exist in your public directory</p>
            
            <div style={{ marginTop: '20px' }}>
                <h2>Results:</h2>
                <ul>
                    {images.map(path => (
                        <li key={path} style={{ margin: '10px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ 
                                    width: '20px', 
                                    height: '20px', 
                                    borderRadius: '50%', 
                                    backgroundColor: imageStatus[path] === 'loaded' ? 'green' : 'red',
                                    marginRight: '10px'
                                }}></div>
                                <span>{path}: {imageStatus[path] || 'checking...'}</span>
                            </div>
                            {imageStatus[path] === 'loaded' && (
                                <div style={{ marginTop: '5px' }}>
                                    <img 
                                        src={path} 
                                        alt="Image preview" 
                                        style={{ height: '100px', border: '1px solid #ccc' }} 
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            
            <div style={{ marginTop: '30px' }}>
                <h2>Custom Path Check:</h2>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Enter image path to check" 
                        style={{ padding: '8px', width: '300px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const path = e.target.value;
                                if (path && !images.includes(path)) {
                                    setImages([...images, path]);
                                    e.target.value = '';
                                }
                            }
                        }}
                    />
                    <button 
                        style={{ padding: '8px 15px', marginLeft: '10px' }}
                        onClick={() => {
                            const input = document.querySelector('input');
                            const path = input.value;
                            if (path && !images.includes(path)) {
                                setImages([...images, path]);
                                input.value = '';
                            }
                        }}
                    >
                        Check
                    </button>
                </div>
            </div>
        </div>
    );
}