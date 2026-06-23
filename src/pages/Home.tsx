import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import QuoteMarquee from '../components/QuoteMarquee';
import ProductCard from '../components/ProductCard';

interface SectionConfig {
  limit: number;
  enabled: boolean;
}

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [aboutImage, setAboutImage] = useState('');
  const [sectionLimits, setSectionLimits] = useState<Record<string, SectionConfig>>({
    new_arrivals: { limit: 8, enabled: true },
    trending: { limit: 8, enabled: true },
    featured: { limit: 8, enabled: true },
    bestseller: { limit: 8, enabled: true },
  });

  useEffect(() => {
    // Fetch homepage config first to get limits
    Promise.all([
      api.get('/api/products/collections'),
      api.get('/api/products/homepage'),
    ]).then(([catRes, hpRes]) => {
      const dbCats = Array.isArray(catRes.data) ? catRes.data : [];
      const savedCats: any[] = hpRes.data?.collection_images?.collections || [];
      const merged = dbCats.map((c: any) => {
        const saved = savedCats.find((s: any) => s.name === c.name);
        return { name: c.name, img: saved?.img || '', path: `/collection?collection=${c.name}` };
      });
      setCollections(merged);
      if (hpRes.data?.about_image?.url) setAboutImage(hpRes.data.about_image.url);

      // Get limits from config
      const limits: Record<string, SectionConfig> = {
        new_arrivals: hpRes.data?.new_arrivals || { limit: 8, enabled: true },
        trending: hpRes.data?.trending || { limit: 8, enabled: true },
        featured: hpRes.data?.featured || { limit: 8, enabled: true },
        bestseller: hpRes.data?.bestseller || { limit: 8, enabled: true },
      };
      setSectionLimits(limits);

      // Fetch each section with its limit
      if (limits.new_arrivals.enabled) {
        api.get(`/api/products?filter=new_arrival&limit=${limits.new_arrivals.limit}`).then(r => setNewArrivals(Array.isArray(r.data) ? r.data : [])).catch(() => {});
      }
      if (limits.trending.enabled) {
        api.get(`/api/products?filter=trending&limit=${limits.trending.limit}`).then(r => setTrending(Array.isArray(r.data) ? r.data : [])).catch(() => {});
      }
      if (limits.featured.enabled) {
        api.get(`/api/products?filter=featured&limit=${limits.featured.limit}`).then(r => setFeatured(Array.isArray(r.data) ? r.data : [])).catch(() => {});
      }
      if (limits.bestseller.enabled) {
        api.get(`/api/products?filter=bestseller&limit=${limits.bestseller.limit}`).then(r => setBestsellers(Array.isArray(r.data) ? r.data : [])).catch(() => {});
      }
    }).catch(() => {
      // Fallback: fetch without config
      api.get('/api/products/collections').then(r => {
        if (Array.isArray(r.data)) setCollections(r.data.map((c: any) => ({ name: c.name, img: '', path: `/collection?collection=${c.name}` })));
      }).catch(() => {});
      api.get('/api/products?filter=new_arrival&limit=8').then(r => setNewArrivals(Array.isArray(r.data) ? r.data : [])).catch(() => {});
      api.get('/api/products?filter=trending&limit=8').then(r => setTrending(Array.isArray(r.data) ? r.data : [])).catch(() => {});
      api.get('/api/products?filter=featured&limit=8').then(r => setFeatured(Array.isArray(r.data) ? r.data : [])).catch(() => {});
      api.get('/api/products?filter=bestseller&limit=8').then(r => setBestsellers(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    });
  }, []);

  const MarqueeSection = ({ items, label, title, statusLink }: { items: any[]; label: string; title: string; statusLink: string }) => (
    <section className="w-full py-16 sm:py-24 border-b-2 border-z-border overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[12px] font-mono uppercase tracking-[0.4em] text-z-muted font-black mb-3">{label}</p>
          <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tighter text-z-ink leading-none">{title}</h2>
        </div>
        <Link to={`/collection?status=${statusLink}`} className="sticker-btn bg-z-ink text-white whitespace-nowrap">View All</Link>
      </div>
      <div className="group">
        <div className="flex gap-6 animate-marquee-scroll hover:[animation-play-state:paused] md:[animation-play-state:running] [animation-play-state:paused] md:animate-marquee-scroll overflow-x-auto md:overflow-visible scrollbar-hide px-6 md:px-0">
          {[...items, ...items].map((p: any, idx: number) => (
            <div key={`${p.id}-${idx}`} className="w-48 sm:w-56 shrink-0">
              <ProductCard {...p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="pt-20">
      <Hero />
      <QuoteMarquee />

      {/* Stats / Social Proof Banner */}
      <section className="border-y-2 border-z-border bg-z-ink text-z-paper py-6">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
          <div>
            <p className="font-display font-black text-3xl sm:text-5xl tracking-tighter">500+</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-z-paper/60 mt-1">Walls Transformed</p>
          </div>
          <div className="w-px h-10 bg-z-paper/20 hidden sm:block" />
          <div>
            <p className="font-display font-black text-3xl sm:text-5xl tracking-tighter">50+</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-z-paper/60 mt-1">Unique Designs</p>
          </div>
          <div className="w-px h-10 bg-z-paper/20 hidden sm:block" />
          <div>
            <p className="font-display font-black text-3xl sm:text-5xl tracking-tighter">6</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-z-paper/60 mt-1">Print Sizes</p>
          </div>
          <div className="w-px h-10 bg-z-paper/20 hidden sm:block" />
          <div>
            <p className="font-display font-black text-3xl sm:text-5xl tracking-tighter">∞</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-z-paper/60 mt-1">Custom Prints</p>
          </div>
        </div>
      </section>

      {/* Collections Marquee */}
      {collections.length > 0 && (
        <section className="w-full py-16 sm:py-24 border-b-2 border-z-border bg-z-paper/50 overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-6 mb-10">
            <p className="text-[12px] font-mono uppercase tracking-[0.4em] text-z-muted font-black mb-3">Browse By</p>
            <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tighter text-z-ink leading-none">Collections</h2>
          </div>
          <div className="group">
            <div className="flex gap-6 animate-marquee-scroll hover:[animation-play-state:paused] md:[animation-play-state:running] [animation-play-state:paused] md:animate-marquee-scroll overflow-x-auto md:overflow-visible scrollbar-hide px-6 md:px-0">
              {[...collections, ...collections].map((cat, idx) => (
                <Link key={idx} to={cat.path} className="snap-center min-w-[200px] sm:min-w-[250px] flex flex-col items-center shrink-0 group/card">
                  <div className="w-48 sm:w-56 aspect-[210/297] overflow-hidden border-2 border-z-border group-hover/card:border-z-ink transition-all shadow-[4px_4px_0px_0px_var(--color-z-shadow)] group-hover/card:shadow-none group-hover/card:translate-x-[2px] group-hover/card:translate-y-[2px]">
                    {cat.img ? (
                      <img src={cat.img} alt={cat.name} loading="lazy" className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-z-border/10 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-z-ink/20 uppercase">{cat.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 font-display font-bold text-sm sm:text-base uppercase tracking-tighter text-z-ink text-center">{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
          <div className="max-w-[1600px] mx-auto px-6 mt-10 flex justify-center">
            <Link to="/collection" className="sticker-btn bg-z-ink text-white">All Collections</Link>
          </div>
        </section>
      )}

      {/* Design Your Own CTA */}
      <section className="py-16 sm:py-24 px-6 border-b-2 border-z-border">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-z-ink text-z-paper p-8 sm:p-16 border-2 border-z-border shadow-[12px_12px_0px_0px_var(--color-z-shadow)] flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1">
              <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-z-paper/50 mb-4">Custom Print Studio</p>
              <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tighter leading-[0.85] mb-6">
                Design Your<br/>Own <span className="text-outline">Prints</span>
              </h2>
              <p className="font-mono text-[13px] text-z-paper/70 uppercase leading-relaxed mb-8 max-w-md">
                Upload any image. Choose your size, layout & style. Available in A3, A4, A5, A6, Polaroid & Pocket sizes. We print and ship it to your door.
              </p>
              <Link to="/customize" className="inline-block bg-z-paper text-z-ink px-8 py-4 font-display font-bold uppercase tracking-widest border-2 border-z-paper hover:bg-transparent hover:text-z-paper transition-all">
                Start Creating →
              </Link>
            </div>
            <div className="flex gap-2 shrink-0 items-end">
              <div className="w-28 sm:w-36 aspect-[210/297] bg-z-paper/10 border-2 border-z-paper/30 flex items-center justify-center">
                <span className="font-display font-black text-2xl sm:text-3xl text-z-paper/30">A3</span>
              </div>
              <div className="w-24 sm:w-30 aspect-[210/297] bg-z-paper/10 border-2 border-z-paper/30 flex items-center justify-center">
                <span className="font-display font-black text-xl sm:text-2xl text-z-paper/30">A4</span>
              </div>
              <div className="w-20 sm:w-24 aspect-[210/297] bg-z-paper/10 border-2 border-z-paper/30 flex items-center justify-center">
                <span className="font-display font-black text-lg sm:text-xl text-z-paper/30">A5</span>
              </div>
              <div className="w-16 sm:w-20 aspect-[210/297] bg-z-paper/10 border-2 border-z-paper/30 flex items-center justify-center">
                <span className="font-display font-black text-sm sm:text-base text-z-paper/30">A6</span>
              </div>
              <div className="w-14 sm:w-16 aspect-[3/4] bg-z-paper/10 border-2 border-z-paper/30 flex items-center justify-center">
                <span className="font-display font-black text-[9px] sm:text-[10px] text-z-paper/30">Polaroid</span>
              </div>
              <div className="w-12 sm:w-14 aspect-[54/86] bg-z-paper/10 border-2 border-z-paper/30 flex items-center justify-center">
                <span className="font-display font-black text-[8px] sm:text-[9px] text-z-paper/30">Pocket</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {sectionLimits.new_arrivals.enabled && newArrivals.length > 0 && (
        <MarqueeSection items={newArrivals} label="#NEW_ARRIVALS" title="New Arrivals" statusLink="New Arrival" />
      )}

      {/* Trending */}
      {sectionLimits.trending.enabled && trending.length > 0 && (
        <MarqueeSection items={trending} label="#TRENDING_NOW" title="Trending" statusLink="Trending" />
      )}

      {/* Bestsellers */}
      {sectionLimits.bestseller.enabled && bestsellers.length > 0 && (
        <MarqueeSection items={bestsellers} label="#BEST_SELLERS" title="Bestsellers" statusLink="Bestseller" />
      )}

      {/* Featured */}
      {sectionLimits.featured.enabled && featured.length > 0 && (
        <MarqueeSection items={featured} label="#FEATURED" title="Featured" statusLink="Featured" />
      )}

      {/* About / Philosophy */}
      <section className="max-w-7xl mx-auto px-6 py-20 sm:py-32 overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="bg-z-ink text-white px-4 py-2 font-mono text-[11px] sm:text-[13px] mb-8 font-bold inline-block uppercase tracking-widest">
              PHILOSOPHY.001
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter mb-8 sm:mb-12 leading-[0.85]">Posters<br/>that curate<br/><span className="text-outline">SPACE.</span></h2>
            <div className="space-y-6 text-z-muted leading-relaxed font-bold font-mono text-sm uppercase border-l-4 border-z-border pl-6">
              <p>[01] Wall art is the most impactful way to define the atmosphere of your environment.</p>
              <p>[02] Every print is curated to be a unique statement piece for your space.</p>
            </div>
            <Link to="/story" className="sticker-btn bg-z-ink text-white mt-12 inline-block">Our Story →</Link>
          </motion.div>
          <div className="relative pt-10 pl-10">
            <div className="absolute top-0 left-0 w-full h-full bg-z-ink z-0 border-2 border-z-border" />
            <div className="polaroid relative z-10">
              <div className="tape top-0 left-1/4" />
              <motion.div initial={{ opacity: 0, scale: 1.1 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }} className="aspect-[210/297] overflow-hidden">
                {aboutImage ? (
                  <img src={aboutImage} alt="Aesthetic space" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-z-border/20 flex items-center justify-center">
                    <span className="text-[11px] font-mono text-z-ink/40 uppercase">No image set</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
