import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Product } from '../../types';
import { formatINR } from '../../utils/calculator';
import { INSPIRATION_STORIES } from '../../data/inspirationStories';
import { 
  ArrowUpRight, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Heart, 
  Search, 
  ExternalLink,
  CheckCircle2,
  Wifi,
  Watch,
  Plus,
  Asterisk,
  Layers,
  ChevronDown,
  Building
} from 'lucide-react';

interface StoreFrontProps {
  onOpenPlayground: (productId?: string) => void;
  onOpenAdmin: () => void;
}

export const StoreFront: React.FC<StoreFrontProps> = ({
  onOpenPlayground,
  onOpenAdmin,
}) => {
  const { 
    products, 
    businessSettings, 
    loadInspirationProject 
  } = useProject();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Hero carousel micro-quote index
  const [heroQuoteIndex, setHeroQuoteIndex] = useState(0);
  const heroQuotes = [
    {
      text: "Your spaces transform while you plan. Make whole-box accuracy your secret weapon for zero waste.",
      location: "Salem, Tamil Nadu",
      date: "Oct. 2026"
    },
    {
      text: "Multi-zone floor layout with Chettinad borders and bookmatched Statuario feature walls.",
      location: "Kandanoor Studio",
      date: "Nov. 2026"
    },
    {
      text: "Every rupee calculated in real-time. No hidden markups or unverified batch rates.",
      location: "Tamil Nadu",
      date: "Current Lot"
    }
  ];

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.finish.includes(q) || p.material.includes(q);
    }
    return true;
  });

  const faqs = [
    {
      q: 'How does the Live Tile Playground calculate prices?',
      a: 'Our estimation engine uses exact physical measurements, cutting wastage (e.g. +10%), and supplier pack coverage rules. It calculates whole boxes or square-foot rates transparently, distinguishing between verified catalogue prices and quote-required items without fabricating numbers.'
    },
    {
      q: 'Where is your physical showroom located?',
      a: `${businessSettings.address}. We welcome homeowners, architects, and civil contractors for lot inspection and tactile surface review.`
    },
    {
      q: 'Can I apply different tiles to different areas of the same room?',
      a: 'Yes! Inside the Tile Playground, you can zone floor areas (e.g., main floor with a Chettinad border or reading corner) and assign separate tiles to backsplashes, feature walls, and shower wet-areas.'
    },
    {
      q: 'What is the delivery timeline for Salem & surrounding Tamil Nadu regions?',
      a: 'In-stock tiles are dispatched from our Salem warehouse within 24 to 48 hours. Special orders or handcrafted natural stone items take 3 to 7 working days.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F4] text-carbon font-sans select-none p-3 sm:p-6 space-y-8 sm:space-y-12">
      
      {/* =========================================================================
          SECTION 1: HERO CONTAINER (Titan Bold Neo-Brutalist Layout)
          ========================================================================= */}
      <section className="relative rounded-3xl sm:rounded-4xl bg-carbon overflow-hidden text-white shadow-elevated p-6 sm:p-10 md:p-14 min-h-[680px] flex flex-col justify-between">
        
        {/* Cinematic Background Architectural Shadow & Lighting */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 pointer-events-none"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/80 to-carbon/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/70 pointer-events-none" />

        {/* 1.1 Header Navigation Inside Hero */}
        <header className="relative z-20 flex items-center justify-between pb-8 border-b border-white/10">
          {/* Logo in Heavy Stencil Style */}
          <div className="flex items-center space-x-2">
            <span className="font-stencil text-2xl sm:text-3xl tracking-wider text-white">
              .KRISHNA
            </span>
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
          </div>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-medium text-muted-light">
            <button onClick={() => onOpenPlayground()} className="hover:text-white transition-colors">
              Playground
            </button>
            <a href="#showcase" className="hover:text-white transition-colors">
              Spaces
            </a>
            <a href="#catalogue" className="hover:text-white transition-colors">
              Catalogue
            </a>
            <a href="#bento" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#showroom" className="hover:text-white transition-colors">
              Showroom
            </a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onOpenAdmin}
              className="text-xs text-muted-light hover:text-white transition-colors font-medium hidden sm:block"
            >
              Admin Portal
            </button>
            <button
              onClick={() => onOpenPlayground()}
              className="px-5 py-2 rounded-full bg-white text-carbon font-semibold text-xs hover:bg-neon hover:text-carbon transition-all duration-300 shadow-sm"
            >
              Try for free
            </button>
          </div>
        </header>

        {/* 1.2 Hero Giant Headline & Primary CTA */}
        <div className="relative z-10 my-12 sm:my-16 max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold tracking-tight text-white leading-[1.05]">
            See every surface. <br />
            Choose every tile. <br />
            Understand every rupee.
          </h1>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Neon Green Pill Button with Circular Arrow */}
            <button
              onClick={() => onOpenPlayground()}
              className="flex items-center space-x-3 bg-neon hover:bg-neon-light text-carbon font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm shadow-neon-glow transition-all hover:scale-105 group"
            >
              <span>Try Playground</span>
              <div className="w-6 h-6 rounded-full bg-carbon text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Dark Glass Pill Button */}
            <a
              href="#catalogue"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm backdrop-blur-md border border-white/10 transition-colors"
            >
              More about Krishna Tiles
            </a>
          </div>
        </div>

        {/* 1.3 Floating Hero Bottom Deck (3 Coordinated Cards) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 pt-6">
          
          {/* Card 1: White Satisfied Clients Pill-Card */}
          <div className="md:col-span-4 bg-white text-carbon p-5 rounded-2xl sm:rounded-3xl shadow-elevated flex flex-col justify-between">
            <div className="flex items-center space-x-3">
              {/* Avatar Stack */}
              <div className="flex -space-x-2">
                <img 
                  className="w-9 h-9 rounded-full border-2 border-white object-cover" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Customer" 
                />
                <img 
                  className="w-9 h-9 rounded-full border-2 border-white object-cover" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
                  alt="Customer" 
                />
                <img 
                  className="w-9 h-9 rounded-full border-2 border-white object-cover" 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" 
                  alt="Customer" 
                />
              </div>
              <div>
                <span className="font-extrabold text-base leading-none block">2,500+</span>
                <span className="text-[11px] text-muted font-medium">satisfied clients</span>
              </div>
            </div>

            <p className="text-[11px] text-muted mt-3 leading-relaxed">
              They arrive with different goals, yet they all find the support, real textures, and pricing certainty they need.
            </p>
          </div>

          {/* Card 2: Glass Editorial Quote Pill-Card with Navigation */}
          <div className="md:col-span-5 bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between text-xs">
            <div className="flex items-start justify-between gap-3">
              <button 
                onClick={() => setHeroQuoteIndex((prev) => (prev > 0 ? prev - 1 : heroQuotes.length - 1))}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center shrink-0 transition-colors"
                title="Previous"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <p className="text-white font-medium leading-relaxed flex-1 text-center sm:text-left">
                {heroQuotes[heroQuoteIndex].text}
              </p>

              <button 
                onClick={() => setHeroQuoteIndex((prev) => (prev < heroQuotes.length - 1 ? prev + 1 : 0))}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center shrink-0 transition-colors"
                title="Next"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-dark mt-4 pt-3 border-t border-white/10">
              <span>{heroQuotes[heroQuoteIndex].location}</span>
              <span>{heroQuotes[heroQuoteIndex].date}</span>
            </div>
          </div>

          {/* Card 3: High-Voltage Electric Neon Accent Card */}
          <div 
            onClick={() => onOpenPlayground()}
            className="md:col-span-3 bg-neon text-carbon p-5 rounded-2xl sm:rounded-3xl shadow-neon-glow flex flex-col justify-between cursor-pointer group hover:bg-neon-light transition-all"
          >
            <div className="flex justify-end">
              <div className="w-8 h-8 rounded-full bg-carbon text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
                Get live estimate in 60s
              </h3>
              <p className="text-[11px] text-carbon/80 font-medium mt-1">
                Instant multi-room plan & whole-box procurement.
              </p>
            </div>
          </div>

        </div>

      </section>


      {/* =========================================================================
          SECTION 2: EDITORIAL SPACE SHOWCASE (Light Background Section)
          ========================================================================= */}
      <section id="showcase" className="py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Pill Tag & Punchy Editorial Typography */}
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full border border-carbon text-xs font-semibold uppercase tracking-wider text-carbon">
              Tile studio
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-carbon leading-[1.12]">
              Welcome to the Krishna Tiles Center, where homeowners and architects design with rupee certainty.
            </h2>

            <div>
              <button
                onClick={() => onOpenPlayground()}
                className="inline-flex items-center space-x-2 bg-carbon text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-carbon-surface transition-all group"
              >
                <span>More</span>
                <div className="w-5 h-5 rounded-full bg-white text-carbon flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>

          {/* Middle Card: Power Zone / Living Lounge */}
          <div 
            onClick={() => onOpenPlayground('prod-statuario-1200')}
            className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-elevated h-[460px] group cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80" 
              alt="Living Lounge"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent" />

            {/* Top Pill Tag */}
            <div className="absolute top-5 left-5">
              <span className="px-4 py-1.5 rounded-full bg-white text-carbon font-bold text-xs shadow-md">
                Grand Living zone
              </span>
            </div>

            {/* Bottom Content with Circular Action */}
            <div className="absolute bottom-6 inset-x-6 flex items-end justify-between text-white">
              <span className="font-bold text-lg max-w-[200px] leading-snug">
                Space for working with Statuario slabs
              </span>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-neon group-hover:text-carbon group-hover:rotate-45 transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Right Card: Cardio Zone / Kitchen & Backsplash */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              onClick={() => onOpenPlayground('prod-subway-emerald')}
              className="relative rounded-3xl overflow-hidden shadow-elevated h-[390px] group cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80" 
                alt="Kitchen Backsplash"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent" />

              {/* Top Pill Tag */}
              <div className="absolute top-5 left-5">
                <span className="px-4 py-1.5 rounded-full bg-white text-carbon font-bold text-xs shadow-md">
                  Gourmet Kitchen zone
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-6 inset-x-6 text-white">
                <span className="font-bold text-lg leading-snug block">
                  Artisanal emerald subway tiles
                </span>
              </div>
            </div>

            {/* Circular Carousel Controls */}
            <div className="flex items-center space-x-3 pt-2">
              <button 
                onClick={() => onOpenPlayground()}
                className="w-10 h-10 rounded-full border border-carbon flex items-center justify-center hover:bg-carbon hover:text-white transition-colors"
                title="Previous space"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onOpenPlayground()}
                className="w-10 h-10 rounded-full bg-carbon text-white flex items-center justify-center hover:bg-neon hover:text-carbon transition-colors"
                title="Next space"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 3: BENTO GRID SPECIFICATION (Dark High-Contrast Section)
          ========================================================================= */}
      <section id="bento" className="rounded-3xl sm:rounded-4xl bg-carbon text-white p-6 sm:p-10 md:p-12 shadow-elevated">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          
          {/* Bento Item 1: Asterisk Icon Card */}
          <div className="lg:col-span-4 bg-carbon-card border border-carbon-border p-6 rounded-3xl flex items-center space-x-5">
            <Asterisk className="w-12 h-12 text-white shrink-0 stroke-[1.5]" />
            <p className="font-semibold text-sm leading-snug text-white">
              Verified porcelain collections each with certified lot quality and batch consistency.
            </p>
          </div>

          {/* Bento Item 4: Center Hero Image with Giant Bold Neon `.T` / `.K` Logo (Span 4) */}
          <div className="lg:col-span-4 sm:row-span-3 relative rounded-3xl overflow-hidden min-h-[360px] lg:min-h-full border border-carbon-border">
            <img 
              src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80" 
              alt="Architectural Showroom"
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-carbon/50 flex items-center justify-center">
              {/* Giant Stencil Monogram in Neon Lime */}
              <span className="font-stencil text-8xl sm:text-9xl text-neon tracking-tighter drop-shadow-lg select-none">
                .K
              </span>
            </div>
          </div>

          {/* Bento Item 5: Wi-Fi Free Icon Card */}
          <div className="lg:col-span-2 bg-carbon-card border border-carbon-border p-5 rounded-3xl flex flex-col items-center justify-center text-center space-y-2">
            <Wifi className="w-8 h-8 text-white" />
            <span className="font-bold text-xs uppercase tracking-wider text-muted-light">
              Live Cloud Sync
            </span>
          </div>

          {/* Bento Item 6: Small Text Tag Card */}
          <div className="lg:col-span-2 bg-carbon-card border border-carbon-border p-5 rounded-3xl flex items-center justify-center text-center">
            <span className="font-semibold text-sm text-white">
              Chettinad Inlays
            </span>
          </div>

          {/* Bento Item 2: Plus Icon Card */}
          <div className="lg:col-span-4 bg-carbon-card border border-carbon-border p-6 rounded-3xl flex items-center space-x-5">
            <Plus className="w-12 h-12 text-white shrink-0 stroke-[2.5]" />
            <p className="font-semibold text-sm leading-snug text-white">
              Architectural consultation, Salem site measurements, and CAD review.
            </p>
          </div>

          {/* Bento Item 7: Watch / Tracker Icon Card */}
          <div className="lg:col-span-4 bg-carbon-card border border-carbon-border p-6 rounded-3xl flex items-center space-x-4">
            <Watch className="w-10 h-10 text-white shrink-0" />
            <p className="font-semibold text-sm text-white leading-snug">
              Live BOQ estimator and smart wastage analysis.
            </p>
          </div>

          {/* Bento Item 3: Numeric Badge Card */}
          <div className="lg:col-span-4 bg-carbon-card border border-carbon-border p-6 rounded-3xl flex items-center space-x-4">
            <span className="font-stencil text-5xl text-white">6</span>
            <div>
              <span className="text-xs font-mono text-muted-light uppercase block">Surface Layers</span>
              <span className="text-sm font-semibold text-white">
                Floor, walls, backsplash, inlays, borders & skirting.
              </span>
            </div>
          </div>

          {/* Bento Item 8: Small Text Card */}
          <div className="lg:col-span-2 bg-carbon-card border border-carbon-border p-5 rounded-3xl flex items-center justify-center text-center">
            <span className="font-semibold text-xs text-white">
              Natural Slate & Vitrified
            </span>
          </div>

          {/* Bento Item 9: Stat Card `2,000 M²` */}
          <div className="lg:col-span-2 bg-carbon-card border border-carbon-border p-5 rounded-3xl flex items-center justify-center text-center">
            <span className="font-stencil text-3xl sm:text-4xl text-white">
              2,000 M²
            </span>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 4: VERIFIED CATALOGUE WITH TRY-IN-PLAYGROUND CTAs
          ========================================================================= */}
      <section id="catalogue" className="py-6 sm:py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full border border-carbon text-xs font-semibold uppercase tracking-wider text-carbon mb-2">
              Stocked Inventory
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-carbon tracking-tight">
              The Krishna Tiles Collection
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model, finish..."
                className="pl-8 pr-4 py-1.5 bg-white border border-border rounded-full text-xs text-carbon focus:outline-none focus:ring-1 focus:ring-carbon"
              />
            </div>

            {['all', 'floor', 'wall', 'elevation', 'outdoor', 'mosaic'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-carbon text-white'
                    : 'bg-white text-muted hover:text-carbon border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const isWishlisted = wishlist.includes(prod.id);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-border overflow-hidden shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-60 bg-stone-light/40 overflow-hidden">
                    <img 
                      src={prod.primaryImage} 
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />

                    {/* Wishlist */}
                    <button
                      onClick={(e) => toggleWishlist(prod.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-carbon hover:bg-white'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>

                    {/* Dimensions Badge */}
                    <div className="absolute bottom-3 left-3 bg-carbon/90 text-white text-[10px] font-mono px-2.5 py-1 rounded-full">
                      {prod.dimensions.widthMm} × {prod.dimensions.heightMm} mm
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span className="font-mono uppercase font-semibold">{prod.sku}</span>
                      <span className="capitalize">{prod.material} • {prod.finish}</span>
                    </div>

                    <h3 className="font-bold text-carbon text-sm line-clamp-1 group-hover:text-brass-dark transition-colors">
                      {prod.name}
                    </h3>

                    {/* Pricing */}
                    <div className="pt-2 flex items-baseline justify-between">
                      <div>
                        {prod.priceBasis === 'quote' ? (
                          <span className="text-xs font-semibold text-amber-700">Price on Request</span>
                        ) : (
                          <span className="text-base font-extrabold text-carbon">
                            {formatINR(prod.pricePerUnit || 0)}{' '}
                            <span className="text-[11px] font-normal text-muted">/{prod.priceBasis}</span>
                          </span>
                        )}
                      </div>
                      {prod.packCoverageSqFt && (
                        <span className="text-[10px] text-muted font-mono">
                          {prod.packCoverageSqFt} sq.ft/box
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card CTA: Try in Playground */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => onOpenPlayground(prod.id)}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-carbon hover:bg-neon hover:text-carbon text-white font-bold rounded-full text-xs transition-colors"
                  >
                    <span>Try in Playground</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* =========================================================================
          SECTION 5: SHOWROOM & FAQ
          ========================================================================= */}
      <section id="showroom" className="bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 border border-border shadow-subtle grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-carbon text-xs font-semibold uppercase tracking-wider text-carbon">
            Salem & Kandanoor Showroom
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-carbon tracking-tight leading-tight">
            Visit Our Live Architectural Center
          </h2>

          <p className="text-muted text-xs sm:text-sm leading-relaxed">
            Experience our comprehensive slab displays, tactile flamed granite steps, and Chettinad art tiles. Our consultants will walk through your Tile Playground plan on our interactive studio screens.
          </p>

          <div className="space-y-2 text-xs text-carbon font-medium">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-carbon shrink-0" />
              <span>{businessSettings.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-carbon shrink-0" />
              <span>Direct: {businessSettings.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-carbon shrink-0" />
              <span>{businessSettings.showroomHours}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <a
              href={businessSettings.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-carbon text-white rounded-full text-xs font-bold hover:bg-carbon-surface transition-colors"
            >
              <span>Get Directions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://wa.me/${businessSettings.whatsappNumber}?text=Hello%20Krishna%20Tiles,%20I%20would%20like%20to%20visit%20your%20Salem%20showroom.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div id="faq" className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
            Common Inquiries
          </span>

          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-border rounded-2xl overflow-hidden bg-ivory/20">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-carbon"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-muted leading-relaxed border-t border-border/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================================
          SECTION 6: FOOTER
          ========================================================================= */}
      <footer className="rounded-3xl bg-carbon text-white py-10 px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-stencil text-2xl tracking-wider text-white">.KRISHNA</span>
            <span className="w-2 h-2 rounded-full bg-neon" />
          </div>
          <p className="text-muted-light text-[11px] mt-1">
            {businessSettings.tagline} • Serving Salem, Kandanoor, Namakkal, and Tamil Nadu.
          </p>
        </div>

        <div className="flex items-center space-x-6 text-muted-light font-medium">
          <button onClick={() => onOpenPlayground()} className="hover:text-white transition-colors">
            Playground
          </button>
          <a href="#catalogue" className="hover:text-white transition-colors">
            Catalogue
          </a>
          <button onClick={onOpenAdmin} className="hover:text-white transition-colors">
            Admin Portal
          </button>
        </div>

        <div className="text-muted-light text-[11px]">
          © {new Date().getFullYear()} Krishna Tiles & Granites.
        </div>
      </footer>

    </div>
  );
};
