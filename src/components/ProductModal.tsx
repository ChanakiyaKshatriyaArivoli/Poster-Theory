import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Minus, Plus, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useCustomizeConfig } from '../hooks/useCustomizeConfig';

interface Props {
  product: any;
  onClose: () => void;
}

const SINGLE_ONLY_SIZES = ['Polaroid', 'Pocket'];

export default function ProductModal({ product, onClose }: Props) {
  const { addToCart } = useCart();
  const { sizes, layouts, sizePrices, layoutPrices, portraitOnly } = useCustomizeConfig();

  const [selectedSize, setSelectedSize] = useState('A4');
  const [selectedLayout, setSelectedLayout] = useState('Single');
  const [printStyle, setPrintStyle] = useState<'full-bleed' | 'white-margin'>('full-bleed');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    product.orientation === 'landscape' ? 'landscape' : 'portrait'
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  // All images for this product
  const images: string[] = useMemo(() => {
    const imgs = Array.isArray(product.images) ? product.images.filter((u: string) => u?.startsWith('http')) : [];
    if (imgs.length === 0 && product.image) return [product.image];
    return imgs;
  }, [product]);

  // Product orientation constraint
  const productOrientation: string = product.orientation || 'both';
  const canChooseOrientation = productOrientation === 'both' && !portraitOnly.includes(selectedSize);

  const selectedLayoutObj = layouts.find(l => l.name === selectedLayout);
  const panelCount = selectedLayoutObj?.panel_count || 1;
  const isSingleOnly = SINGLE_ONLY_SIZES.includes(selectedSize);

  // Only show sizes/layouts the admin has assigned
  const productSizeIds: number[] = Array.isArray(product.available_sizes) ? product.available_sizes : [];
  const productLayoutIds: number[] = Array.isArray(product.available_layouts) ? product.available_layouts : [];

  const availableSizes = useMemo(() => {
    if (productSizeIds.length === 0) return sizes;
    return sizes.filter(s => s.id != null && productSizeIds.includes(s.id));
  }, [sizes, productSizeIds]);

  const availableLayouts = useMemo(() => {
    let filtered = layouts;
    if (productLayoutIds.length > 0) {
      filtered = layouts.filter(l => l.id != null && productLayoutIds.includes(l.id));
    }
    if (isSingleOnly) filtered = filtered.filter(l => l.panel_count === 1);
    return filtered;
  }, [layouts, productLayoutIds, isSingleOnly]);

  useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.find(s => s.name === selectedSize)) {
      setSelectedSize(availableSizes[0].name);
    }
  }, [availableSizes]);

  useEffect(() => {
    if (availableLayouts.length > 0 && !availableLayouts.find(l => l.name === selectedLayout)) {
      setSelectedLayout(availableLayouts[0].name);
    }
  }, [availableLayouts]);

  useEffect(() => {
    if (panelCount > 1) setPrintStyle('full-bleed');
    else if (SINGLE_ONLY_SIZES.includes(selectedSize)) setPrintStyle('white-margin');
  }, [panelCount, selectedSize]);

  useEffect(() => {
    if (portraitOnly.includes(selectedSize)) setOrientation('portrait');
    else if (productOrientation === 'portrait') setOrientation('portrait');
    else if (productOrientation === 'landscape') setOrientation('landscape');
  }, [selectedSize, portraitOnly, productOrientation]);

  const price = useMemo(() => {
    return layoutPrices[`${selectedSize}-${selectedLayout}`] || (sizePrices[selectedSize] || 0) * panelCount;
  }, [selectedSize, selectedLayout, sizePrices, layoutPrices, panelCount]);

  const nextImg = () => setCurrentImg(prev => (prev + 1) % images.length);
  const prevImg = () => setCurrentImg(prev => (prev - 1 + images.length) % images.length);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price,
      image: images[0],
      collection: product.collection_name || '',
      size: `${selectedSize} ${orientation} - ${selectedLayout}`,
      quantity,
      customSpecs: {
        size: selectedSize,
        orientation,
        layout: selectedLayout,
        panelCount,
        printStyle,
        unitCount: quantity,
      }
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-z-paper border-2 border-z-border shadow-[8px_8px_0px_0px_var(--color-z-shadow)] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-20 w-8 h-8 bg-z-ink text-z-paper flex items-center justify-center hover:opacity-80">
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left - Image Slideshow */}
          <div className="p-6 bg-gray-50 dark:bg-z-ink/5 flex flex-col items-center justify-center min-h-[400px] border-b md:border-b-0 md:border-r border-z-border/30 relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImg}
                src={images[currentImg]}
                alt={product.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-h-[380px] max-w-full object-contain"
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-z-paper border border-z-border flex items-center justify-center hover:bg-z-ink hover:text-z-paper transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-z-paper border border-z-border flex items-center justify-center hover:bg-z-ink hover:text-z-paper transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-4">
                  {images.map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentImg(idx)}
                      className={`w-12 h-12 border-2 overflow-hidden transition-all ${currentImg === idx ? 'border-z-ink' : 'border-z-border/30 opacity-60 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right - Options */}
          <div className="p-6 flex flex-col">
            <h2 className="font-display font-black text-2xl uppercase tracking-tighter text-z-ink mb-1">{product.title}</h2>
            <p className="text-[10px] font-mono text-z-muted uppercase mb-6">{product.collection_name || 'Poster'}</p>

            {/* Size */}
            <div className="mb-4">
              <label className="text-[9px] font-mono font-black uppercase tracking-widest text-z-muted mb-2 block">Paper Size</label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(s => (
                  <button key={s.name} onClick={() => setSelectedSize(s.name)}
                    className={`px-3 py-1.5 text-[10px] font-mono font-black uppercase border-2 transition-all active:scale-95 ${
                      selectedSize === s.name ? 'bg-z-ink text-z-paper border-z-ink' : 'border-z-border hover:border-z-ink text-z-ink'
                    }`}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            {canChooseOrientation && (
              <div className="mb-4">
                <label className="text-[9px] font-mono font-black uppercase tracking-widest text-z-muted mb-2 block">Orientation</label>
                <div className="flex gap-2">
                  <button onClick={() => setOrientation('portrait')}
                    className={`px-3 py-1.5 text-[10px] font-mono font-black uppercase border-2 transition-all active:scale-95 ${
                      orientation === 'portrait' ? 'bg-z-ink text-z-paper border-z-ink' : 'border-z-border hover:border-z-ink text-z-ink'
                    }`}>Portrait</button>
                  <button onClick={() => setOrientation('landscape')}
                    className={`px-3 py-1.5 text-[10px] font-mono font-black uppercase border-2 transition-all active:scale-95 ${
                      orientation === 'landscape' ? 'bg-z-ink text-z-paper border-z-ink' : 'border-z-border hover:border-z-ink text-z-ink'
                    }`}>Landscape</button>
                </div>
              </div>
            )}

            {/* Layout */}
            <div className="mb-4">
              <label className="text-[9px] font-mono font-black uppercase tracking-widest text-z-muted mb-2 block">Layout</label>
              <div className="flex flex-wrap gap-2">
                {availableLayouts.map(l => (
                  <button key={l.name} onClick={() => setSelectedLayout(l.name)}
                    className={`px-3 py-1.5 text-[10px] font-mono font-black uppercase border-2 transition-all active:scale-95 ${
                      selectedLayout === l.name ? 'bg-z-ink text-z-paper border-z-ink' : 'border-z-border hover:border-z-ink text-z-ink'
                    }`}>
                    {l.name} {l.panel_count > 1 && `(${l.panel_count})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Print Style - only for single layout, not for Polaroid/Pocket */}
            {panelCount <= 1 && !SINGLE_ONLY_SIZES.includes(selectedSize) && (
              <div className="mb-4">
                <label className="text-[9px] font-mono font-black uppercase tracking-widest text-z-muted mb-2 block">Print Style</label>
                <div className="flex gap-2">
                  <button onClick={() => setPrintStyle('full-bleed')}
                    className={`px-3 py-1.5 text-[10px] font-mono font-black uppercase border-2 transition-all active:scale-95 ${
                      printStyle === 'full-bleed' ? 'bg-z-ink text-z-paper border-z-ink' : 'border-z-border hover:border-z-ink text-z-ink'
                    }`}>Borderless</button>
                  <button onClick={() => setPrintStyle('white-margin')}
                    className={`px-3 py-1.5 text-[10px] font-mono font-black uppercase border-2 transition-all active:scale-95 ${
                      printStyle === 'white-margin' ? 'bg-z-ink text-z-paper border-z-ink' : 'border-z-border hover:border-z-ink text-z-ink'
                    }`}>White Margin</button>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-5">
              <label className="text-[9px] font-mono font-black uppercase tracking-widest text-z-muted mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 border-2 border-z-border flex items-center justify-center hover:bg-z-ink hover:text-z-paper transition-all active:scale-95">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-[14px] font-mono font-black text-z-ink w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 border-2 border-z-border flex items-center justify-center hover:bg-z-ink hover:text-z-paper transition-all active:scale-95">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Price + Add to Cart */}
            <div className="mt-auto pt-4 border-t border-z-border/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-z-muted uppercase">
                  {selectedSize} {orientation[0].toUpperCase()} · {selectedLayout} · x{quantity}
                </span>
                <span className="text-xl font-display font-black text-z-ink">₹{price * quantity}</span>
              </div>
              <button onClick={handleAddToCart}
                className={`w-full py-3 text-[11px] font-mono font-black uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[4px_4px_0px_0px_var(--color-z-shadow)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${
                  added ? 'bg-green-500 text-white' : 'bg-z-ink text-z-paper'
                }`}>
                <ShoppingBag className="w-4 h-4" /> {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}


