import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

// --- TYPES ---
interface InstagramMedia {
    id: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    thumbnail_url?: string;
    permalink: string;
}

// --- CONFIGURATION ---
// In a real build, set VITE_INSTAGRAM_TOKEN in your .env file
const INSTAGRAM_TOKEN = import.meta.env.VITE_INSTAGRAM_TOKEN || '';

// --- MUSEUM GRADE FALLBACK ---
// These high-res local assets are used if:
// 1. No token is provided (Default state)
// 2. The API fetch fails or rate limits
// 3. The token expires
const FALLBACK_POSTS: InstagramMedia[] = [
    {
        id: 'fallback-1',
        media_type: 'IMAGE',
        media_url: '/zizi-webp/collector-dior-eloise.webp',
        permalink: 'https://www.instagram.com/zizi__designs/'
    },
    {
        id: 'fallback-2',
        media_type: 'IMAGE',
        media_url: '/zizi-webp/collector-fendi-vittoria.webp',
        permalink: 'https://www.instagram.com/zizi__designs/'
    },
    {
        id: 'fallback-3',
        media_type: 'IMAGE',
        media_url: '/zizi-webp/collector-lv-aurele.webp',
        permalink: 'https://www.instagram.com/zizi__designs/'
    },
    {
        id: 'fallback-4',
        media_type: 'IMAGE',
        media_url: '/zizi-webp/dior-eloise-hero.webp',
        permalink: 'https://www.instagram.com/zizi__designs/'
    }
];

const InstagramArchive: React.FC = () => {
    const [media, setMedia] = useState<InstagramMedia[]>(FALLBACK_POSTS); // Default to fallback immediately (no flicker)
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        const fetchInstagramMedia = async () => {
            if (!INSTAGRAM_TOKEN) return; // Stay on fallback if no token

            try {
                // Fetch fields: ID, Type, URL, Thumbnail (for videos), Permalink
                const response = await fetch(
                    `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink&access_token=${INSTAGRAM_TOKEN}&limit=4`
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.data && data.data.length > 0) {
                        setMedia(data.data.slice(0, 4));
                        setIsLive(true);
                    }
                } else {
                    console.warn('ZIZI Instagram: Triggering fallback (API Error)');
                }
            } catch (error) {
                console.warn('ZIZI Instagram: Triggering fallback (Network Error)');
            }
        };

        fetchInstagramMedia();
    }, []);

    return (
        <section className="h-full w-full bg-[#f4f4f4] relative flex flex-col justify-center items-center py-24 md:py-32 px-6">
            <div className="max-w-[1400px] w-full mx-auto">
                <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-6 transition-opacity duration-1000">
                        {isLive ? 'Live Feed' : 'Collected Moments'}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-black mb-6">
                        From the Archive
                    </h2>
                    <div className="w-12 h-[1px] bg-black/10 my-4"></div>
                    <a
                        href="https://www.instagram.com/zizi__designs/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 font-light text-sm tracking-widest uppercase hover:text-black transition-colors"
                    >
                        @ZIZI__DESIGNS
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {media.map((item) => (
                        <a
                            key={item.id}
                            href={item.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square bg-gray-100 overflow-hidden cursor-pointer"
                        >
                            <img
                                src={item.media_type === 'VIDEO' ? (item.thumbnail_url || item.media_url) : item.media_url}
                                alt="Zizi Archive Moment"
                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                            {/* Cinematic Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />

                            {/* Subtle Icon on Hover */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                                <ArrowUpRight className="text-white drop-shadow-md" size={18} />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InstagramArchive;
