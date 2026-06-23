import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from './Logo';
import api from '../lib/api';

const FALLBACK_IMAGES = [
  { url: '/uploads/hero/placeholder.png', ref: '001' },
];

export default function Hero() {
  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="relative min-h-[80vh] sm:min-h-[90vh] w-full flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
        {/* Left — Text Content */}
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Logo size="hero" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-z-ink leading-[0.9] mb-4 sm:mb-6"
          >
            Premium Posters<br/>
            <span className="text-z-muted">For Your Walls</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[12px] sm:text-[14px] font-mono text-z-muted leading-relaxed mb-6 sm:mb-8 max-w-md"
          >
            Curated poster prints in Anime, Movies, Music, Minimal & more. Available in A3 to Pocket sizes. Printed on 300 GSM matte paper.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <Link to="/collection" className="px-6 sm:px-8 py-3 bg-z-ink text-white font-mono text-[11px] sm:text-[12px] font-bold uppercase tracking-widest hover:bg-z-ink/80 transition-colors">
              Shop Now
            </Link>
            <Link to="/customize" className="px-6 sm:px-8 py-3 border-2 border-z-ink text-z-ink font-mono text-[11px] sm:text-[12px] font-bold uppercase tracking-widest hover:bg-z-ink hover:text-white transition-all">
              Custom Print
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-z-border/50"
          >
            <div>
              <p className="font-display font-black text-xl sm:text-2xl text-z-ink">500+</p>
              <p className="text-[8px] sm:text-[9px] font-mono text-z-muted uppercase">Happy Customers</p>
            </div>
            <div className="w-px h-6 sm:h-8 bg-z-border" />
            <div>
              <p className="font-display font-black text-xl sm:text-2xl text-z-ink">6</p>
              <p className="text-[8px] sm:text-[9px] font-mono text-z-muted uppercase">Print Sizes</p>
            </div>
            <div className="w-px h-6 sm:h-8 bg-z-border" />
            <div>
              <p className="font-display font-black text-xl sm:text-2xl text-z-ink">₹69</p>
              <p className="text-[8px] sm:text-[9px] font-mono text-z-muted uppercase">Starting At</p>
            </div>
          </motion.div>
        </div>

        {/* Right — Poster Carousel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[3/4]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex].url}
                alt="Featured poster"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover border-2 border-z-border shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
              />
            </AnimatePresence>

            {/* Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button onClick={prev} className="w-8 h-8 bg-white/90 border border-z-border flex items-center justify-center hover:bg-z-ink hover:text-white transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} className="w-8 h-8 bg-white/90 border border-z-border flex items-center justify-center hover:bg-z-ink hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-1.5">
                {images.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-z-ink w-6' : 'bg-z-ink/30'}`} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
