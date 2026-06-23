import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import api from '../lib/api';

const FALLBACK_IMAGES = [
  { url: '/uploads/hero/placeholder.png', ref: '001//POSTER_THEORY' },
];

export default function Hero() {
  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    api.get('/api/products/homepage').then(res => {
      const heroImages = res.data?.hero_images?.images;
      if (Array.isArray(heroImages) && heroImages.length > 0) {
        const valid = heroImages.filter((i: any) => i.url);
        if (valid.length > 0) setImages(valid);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6 py-32">
      {/* Background Poster Text */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-[0.05] select-none pointer-events-none whitespace-nowrap overflow-hidden">
        <p className="poster-title leading-none tracking-tighter -translate-x-[5%] text-outline">
          POSTER THEORY* POSTER THEORY*
        </p>
      </div>

      <div className="max-w-[1440px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-z-ink text-z-paper px-4 py-1.5 sm:px-6 sm:py-2 font-mono text-[11px] sm:text-[13px] mb-6 sm:mb-8 font-bold uppercase tracking-widest"
          >
            VOL. 02 // POSTER_COLLECTION.2024
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10 sm:mb-16 w-full max-w-[1000px] flex items-start"
          >
            <Logo size="hero" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 w-full"
          >
            <div className="max-w-[280px] sm:max-w-[320px]">
              <p className="text-[12px] sm:text-sm font-mono uppercase tracking-widest text-z-muted leading-relaxed font-bold border-l-2 border-z-border pl-4 sm:pl-6">
                [POSTER_ARCHIVE_EXHIBIT]
                <br/>
                High-definition prints and curative posters for the digital generation.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/collection" className="sticker-btn bg-z-ink text-z-paper text-sm sm:text-base">
                VIEW_POSTERS_
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Art Display (Polaroid Carousel) */}
        <div className="lg:col-span-5 relative h-[400px] sm:h-[500px] flex items-center justify-center">
          <div className="relative w-full max-w-sm h-[480px]">
            <AnimatePresence mode="popLayout">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: currentIndex % 2 === 0 ? -3 : 3 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 0 }}
                transition={{ 
                  duration: 0.8, 
                  type: 'spring', 
                  stiffness: 70, 
                  damping: 15 
                }}
                className="polaroid absolute inset-0 z-20 w-full p-1 border-[1px] border-z-border shadow-[4px_4px_0px_0px_var(--color-z-shadow)]"
              >
                <div className="tape -top-2 left-1/2 -translate-x-1/2 w-24 h-4 opacity-40 group-hover:opacity-100 transition-opacity z-30" />
                <img 
                  src={images[currentIndex].url} 
                  alt={`Carousel ${currentIndex}`} 
                  className="w-full aspect-[4/5] object-cover bg-z-paper" 
                  loading="lazy"
                />
                <div className="mt-2 flex justify-between items-center border-t border-z-border pt-4 px-4 pb-2">
                   <p className="font-mono text-[11px] font-bold uppercase tracking-tight opacity-70">REF: {images[currentIndex].ref}</p>
                   <div className="flex space-x-1">
                      <button onClick={(e) => { e.preventDefault(); prev(); }} className="hover:bg-z-ink hover:text-z-paper transition-all p-1 border border-transparent hover:border-z-border">
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => { e.preventDefault(); next(); }} className="hover:bg-z-ink hover:text-z-paper transition-all p-1 border border-transparent hover:border-z-border">
                        <ChevronRight className="w-3 h-3" />
                      </button>
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Background stack decoration */}
            <div className="absolute top-4 left-4 w-full h-full border-2 border-z-border -z-10 rotate-2 bg-z-paper opacity-50" />
            <div className="absolute top-2 left-2 w-full h-full border-2 border-z-border -z-20 -rotate-3 bg-z-paper opacity-30" />
          </div>

          <motion.div
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-z-accent text-z-paper rounded-full flex items-center justify-center text-center p-6 border-2 border-z-border shadow-lg dark:shadow-white/10 font-display font-bold text-[13px] uppercase leading-tight z-30"
          >
            New<br/>Full Color<br/>Drop
          </motion.div>
        </div>
      </div>
    </section>
  );
}
