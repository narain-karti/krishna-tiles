import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Product, TileCategory } from '../../types';
import { formatINR } from '../../utils/calculator';
import { getTileBackgroundStyle } from '../../utils/tileRenderer';
import { INSPIRATION_STORIES } from '../../data/inspirationStories';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  ChevronRight, 
  Heart, 
  Search, 
  ExternalLink,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  Building,
  HelpCircle
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
    loadInspirationProject,
    activeRoom,
    assignTileToSurface 
  } = useProject();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleTryInPlayground = (product: Product) => {
    onOpenPlayground(product.id);
  };

  const handleLoadInspiration = (story: typeof INSPIRATION_STORIES[0]) => {
    loadInspirationProject(story.productIds, story.title);
    onOpenPlayground();
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
    <div className="min-h-screen bg-[#FAF9F6] text-charcoal font-sans select-none">
      
      {/* 1. Top Announcement Bar */}
      <div className="bg-charcoal text-ivory text-[11px] py-2 px-6 flex items-center justify-between border-b border-charcoal-muted">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-brass animate-pulse" />
          <span>Salem & Kandanoor Showroom: Mon – Sat 9:00 AM – 8:30 PM</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href={`tel:${businessSettings.phone}`} className="hover:text-brass-light transition-colors flex items-center space-x-1">
            <Phone className="w-3 h-3" />
            <span>{businessSettings.phone}</span>
          </a>
          <button 
            onClick={onOpenAdmin}
            className="text-stone-dark hover:text-ivory underline transition-colors"
          >
            Admin Portal
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <nav className="sticky top-0 bg-[#FAF9F6]/90 backdrop-blur-md z-40 border-b border-border/80 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-charcoal flex items-center justify-center font-serif font-bold text-brass-light text-xl shadow-sm">
            KT
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-charcoal tracking-wide block leading-none">
              {businessSettings.businessName}
            </span>
            <span className="text-[10px] text-muted tracking-widest uppercase font-mono mt-0.5 block">
              Architectural Tile Studio • Salem
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
          <a href="#catalogue" className="hover:text-brass transition-colors">Catalogue</a>
          <a href="#by-room" className="hover:text-brass transition-colors">By Room</a>
          <a href="#inspiration" className="hover:text-brass transition-colors">Inspiration</a>
          <a href="#showroom" className="hover:text-brass transition-colors">Showroom</a>
          <a href="#faq" className="hover:text-brass transition-colors">FAQ</a>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onOpenPlayground()}
            className="relative flex items-center space-x-2 bg-brass hover:bg-brass-light text-charcoal font-semibold px-5 py-2.5 rounded-xl text-xs shadow-brass-glow hover:scale-105 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Tile Playground</span>
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-charcoal text-ivory text-[9px] font-mono rounded-full">
              Live
            </span>
          </button>
        </div>
      </nav>

      {/* 3. Hero Section (Aestic Architectural Reference Inspired) */}
      <section className="relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden px-6 sm:px-12 py-16 bg-ivory">
        {/* Full-width Architectural Image Background with Warm Editorial Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/60 to-charcoal/40" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-4xl mx-auto text-center text-ivory space-y-6 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-brass-light uppercase tracking-widest font-mono">
            <span>Kandanoor & Salem, Tamil Nadu</span>
            <span>•</span>
            <span>Live Interactive Configurator</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-medium tracking-tight text-[#FAF9F6] leading-[1.08]">
            Every Space Begins <br className="hidden sm:inline" />
            <span className="italic font-normal text-brass-light">With the Right Tile.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone font-light max-w-2xl mx-auto leading-relaxed">
            Explore authentic textures, experiment with multi-zone floors and walls, and understand every rupee with real-time transparent calculations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenPlayground()}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-brass hover:bg-brass-light text-charcoal font-semibold rounded-2xl text-sm shadow-brass-glow transition-all hover:scale-105"
            >
              <span>Design My Space (Playground)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#catalogue"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md text-ivory font-medium rounded-2xl text-sm border border-white/20 transition-colors"
            >
              <span>Explore Tile Catalogue</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="pt-8 grid grid-cols-3 max-w-xl mx-auto border-t border-white/20 text-center text-xs">
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-ivory block">150+</span>
              <span className="text-stone text-[11px]">Architectural Designs</span>
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-ivory block">Salem</span>
              <span className="text-stone text-[11px]">Flagship Showroom</span>
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-ivory block">Live ₹</span>
              <span className="text-stone text-[11px]">Transparent Estimator</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Live Playground Feature Teaser */}
      <section className="py-20 px-6 sm:px-12 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-brass">
              <Compass className="w-4 h-4" />
              <span>The Core Innovation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal leading-tight">
              See every surface. <br />
              Choose every tile. <br />
              <span className="italic text-brass-dark">Understand every rupee.</span>
            </h2>

            <p className="text-muted text-sm leading-relaxed">
              Never buy tiles from an isolated sample board again. Our live playground lets you build entire rooms, partition floor zones with decorative inlays, coordinate wall backsplashes, and view true-to-aspect tile patterns with realistic grout joints.
            </p>

            <ul className="space-y-3 text-xs text-charcoal font-medium">
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-brass shrink-0" />
                <span>Multi-zone floor splitting (main floor + border rug + feature sections)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-brass shrink-0" />
                <span>Instant texture replacement on room mock-ups and CAD plans</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-brass shrink-0" />
                <span>Precise whole-box quantity calculation including configurable wastage</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-brass shrink-0" />
                <span>Direct WhatsApp and printable PDF estimate with no mystery prices</span>
              </li>
            </ul>

            <button
              onClick={() => onOpenPlayground()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-charcoal text-ivory hover:bg-charcoal-soft rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              <span>Launch Playground with Demo Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Teaser Mockup */}
          <div 
            onClick={() => onOpenPlayground()}
            className="cursor-pointer group relative rounded-3xl overflow-hidden border-2 border-border shadow-elevated bg-[#EDE8DF] p-6 hover:border-brass transition-all"
          >
            <div className="relative h-72 rounded-2xl overflow-hidden shadow-inner border border-border">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                alt="Playground Interface Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-[10px] font-mono text-brass-light uppercase">Click to open</span>
                  <div className="text-lg font-serif font-bold text-ivory">Interactive Tile Playground</div>
                  <div className="text-xs text-stone mt-0.5">5 coordinated visualization modes & live BOQ</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted">
              <span>Living Room • Chef Kitchen • Master Suite • Balcony</span>
              <span className="text-brass font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                Try it now <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Inspiration Stories Gallery */}
      <section id="inspiration" className="py-20 px-6 sm:px-12 bg-ivory">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brass block">
              Curated Architectural Concepts
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
              Chettinad Heritage & Contemporary Fusion
            </h2>
            <p className="text-xs text-muted">
              Each inspiration project features coordinated tiles currently stocked in our Salem warehouse. Load any concept directly into your playground.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {INSPIRATION_STORIES.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-3xl overflow-hidden border border-border shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-charcoal/90 text-ivory px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {story.roomType}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-brass font-medium">
                        {story.style}
                      </span>
                      <span className="text-xs font-semibold text-charcoal">
                        {story.estimatedCostRange}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-charcoal">
                      {story.title}
                    </h3>

                    <p className="text-xs text-muted leading-relaxed">
                      {story.description}
                    </p>

                    {/* Specified Tiles */}
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-semibold text-muted tracking-wider block mb-1.5">
                        Selected Combination:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {story.productNames.map((name, i) => (
                          <span key={i} className="text-xs bg-ivory text-charcoal px-2.5 py-1 rounded-md border border-border/80">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-border/60 mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    {story.colorPalette.map((col, idx) => (
                      <span
                        key={idx}
                        className="w-4 h-4 rounded-full border border-border shadow-xs"
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleLoadInspiration(story)}
                    className="flex items-center space-x-1.5 text-xs font-semibold bg-brass hover:bg-brass-light text-charcoal px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <span>Load in Playground</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Product Catalogue Section */}
      <section id="catalogue" className="py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brass block mb-1">
                Verified Inventory
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
                The Krishna Tiles Collection
              </h2>
              <p className="text-xs text-muted mt-1">
                Precision vitrified slabs, authentic slate, wood plank tiles, and Chettinad art ceramics.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search marble, slate, wood..."
                  className="pl-9 pr-4 py-2 bg-ivory border border-border rounded-xl text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-brass"
                />
              </div>

              {['all', 'floor', 'wall', 'elevation', 'outdoor', 'mosaic'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-charcoal text-ivory shadow-sm'
                      : 'bg-ivory text-muted hover:text-charcoal border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => {
              const isWishlisted = wishlist.includes(prod.id);
              const swatchStyle = getTileBackgroundStyle(prod, 'grid', 2, '#D8D0C3', 0);

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-border shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image / Swatch Container */}
                    <div className="relative h-56 bg-stone-light/50 overflow-hidden">
                      <img
                        src={prod.primaryImage}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(prod.id, e)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                          isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/80 text-muted hover:text-charcoal'
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                      </button>

                      {/* Dimensions Overlay */}
                      <div className="absolute bottom-3 left-3 bg-charcoal/85 backdrop-blur-sm text-ivory text-[10px] font-mono px-2.5 py-1 rounded-md">
                        {prod.dimensions.widthMm} × {prod.dimensions.heightMm} mm
                      </div>

                      {/* Sample Flag if unverified */}
                      {prod.isSampleRecord && (
                        <div className="absolute top-3 left-3 bg-amber-500/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded shadow-sm">
                          Verified Model Spec
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-muted">
                        <span className="font-mono uppercase">{prod.sku}</span>
                        <span className="capitalize">{prod.material} • {prod.finish}</span>
                      </div>

                      <h3 className="font-semibold text-charcoal text-sm line-clamp-1 group-hover:text-brass-dark transition-colors">
                        {prod.name}
                      </h3>

                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>

                      {/* Pricing Tag */}
                      <div className="pt-2 flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-muted uppercase tracking-wider block">Price</span>
                          {prod.priceBasis === 'quote' ? (
                            <span className="text-xs font-semibold text-amber-700">Price on Request</span>
                          ) : (
                            <span className="text-base font-bold text-charcoal font-serif">
                              {formatINR(prod.pricePerUnit || 0)}{' '}
                              <span className="text-[11px] font-sans font-normal text-muted">/{prod.priceBasis}</span>
                            </span>
                          )}
                        </div>

                        {prod.packCoverageSqFt && (
                          <div className="text-right text-[10px] text-muted font-mono">
                            {prod.packCoverageSqFt} sq.ft/box
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Try in Playground Button (Primary CTA required by Part 2.1) */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleTryInPlayground(prod)}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 bg-ivory hover:bg-brass text-charcoal font-semibold rounded-xl text-xs border border-border group-hover:border-brass transition-all shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brass group-hover:text-charcoal" />
                      <span>Try This Tile in Room Playground</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. Showroom & Trust Section */}
      <section id="showroom" className="py-20 px-6 sm:px-12 bg-ivory border-t border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-brass block">
              Salem & Kandanoor Showroom
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
              Visit Our Architectural Studio
            </h2>
            <p className="text-muted text-sm leading-relaxed">
              Experience large-format vitrified slabs, authentic Salem black granites, and handcrafted Chettinad art ceramics in real natural lighting. Our consultants will walk through your Tile Playground plan on our interactive showroom screens.
            </p>

            <div className="space-y-3 text-xs text-charcoal">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brass shrink-0 mt-0.5" />
                <span>{businessSettings.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brass shrink-0" />
                <span>Call: {businessSettings.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-brass shrink-0" />
                <span>{businessSettings.showroomHours}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <a
                href={businessSettings.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-charcoal text-ivory rounded-xl text-xs font-semibold hover:bg-charcoal-soft transition-colors"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://wa.me/${businessSettings.whatsappNumber}?text=Hello%20Krishna%20Tiles,%20I%20would%20like%20to%20visit%20your%20Salem%20showroom.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-elevated border-2 border-border h-80 sm:h-96">
            <img
              src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80"
              alt="Krishna Tiles Showroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent flex items-end p-6">
              <div className="text-ivory">
                <span className="text-xs font-mono text-brass-light uppercase">Direct Showroom Experience</span>
                <h4 className="text-lg font-serif font-bold">Over 2,000 sq.ft of Live Tile Displays</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section id="faq" className="py-20 px-6 sm:px-12 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brass">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-serif font-bold text-charcoal">
              Guidance for Homeowners & Architects
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-border rounded-2xl overflow-hidden bg-ivory/30"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-charcoal"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-muted transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-muted leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-charcoal text-ivory py-12 px-6 sm:px-12 border-t border-charcoal-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone">
          <div>
            <span className="text-base font-serif font-bold text-ivory uppercase block">
              {businessSettings.businessName}
            </span>
            <p className="text-stone-dark mt-1">
              {businessSettings.tagline} • Serving Salem, Kandanoor, Namakkal, and Tamil Nadu.
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => onOpenPlayground()} className="hover:text-brass-light transition-colors">
              Tile Playground
            </button>
            <a href="#catalogue" className="hover:text-brass-light transition-colors">
              Catalogue
            </a>
            <button onClick={onOpenAdmin} className="hover:text-brass-light transition-colors">
              Admin Portal
            </button>
          </div>

          <div className="text-stone-dark text-[11px]">
            © {new Date().getFullYear()} Krishna Tiles & Granites. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};
