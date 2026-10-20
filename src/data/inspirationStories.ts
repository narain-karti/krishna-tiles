export interface InspirationStory {
  id: string;
  title: string;
  roomType: string;
  subtitle: string;
  description: string;
  image: string;
  style: string;
  colorPalette: string[];
  productIds: string[];
  productNames: string[];
  estimatedCostRange: string;
}

export const INSPIRATION_STORIES: InspirationStory[] = [
  {
    id: 'insp-chettinad-grandeur',
    title: 'Heritage Chettinad Courtyard',
    roomType: 'Living & Courtyard',
    subtitle: 'Classic Chettinad artistry meets modern Italian porcelain craftsmanship',
    description: 'An open-air Salem courtyard featuring Royal Statuario porcelain floor slabs framed by deep cobalt and brass Chettinad geometric border tiles. Accented with natural split-face slate feature walls.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    style: 'Heritage Fusion',
    colorPalette: ['#FAF9F6', '#254460', '#B89A63', '#29251F'],
    productIds: ['prod-statuario-1200', 'prod-chettinad-accent', 'prod-charcoal-splitface'],
    productNames: ['Royal Statuario Gold Slab', 'Chettinad Heritage Blue', 'Charcoal Slate Split-Face'],
    estimatedCostRange: '₹110 – ₹135 / sq.ft',
  },
  {
    id: 'insp-scandi-zen',
    title: 'Minimalist Salem Villa Suite',
    roomType: 'Master Bedroom',
    subtitle: 'Organic warmth of Nordic oak planks balanced with earthen slate textures',
    description: 'A serene master bedroom sanctuary paved with warm embossed Nordic oak vitrified planks, anchored by a full-height Indian Autumn slate feature headboard wall.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    style: 'Scandinavian Organic',
    colorPalette: ['#C9A36E', '#524B41', '#FAF9F6', '#D8D0C3'],
    productIds: ['prod-wood-plank-1200', 'prod-slate-2023'],
    productNames: ['Nordic Natural Oak Wood Plank', 'Indian Autumn Slate Rectangle'],
    estimatedCostRange: '₹95 – ₹115 / sq.ft',
  },
  {
    id: 'insp-emerald-kitchen',
    title: 'The Artisanal Gourmet Kitchen',
    roomType: 'Chef Kitchen',
    subtitle: 'Beveled emerald subway backsplashes paired with Navona Travertine matte flooring',
    description: 'A dramatic culinary space featuring rich beveled deep-emerald subway wall tiles in running-bond, paired with silky Italian Travertine beige 800×800mm floor tiles and warm brass cabinetry hardware.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    style: 'Modern Classic',
    colorPalette: ['#1D4E3E', '#EAE2D5', '#FAF9F6', '#B89A63'],
    productIds: ['prod-subway-emerald', 'prod-travertine-800'],
    productNames: ['Emerald Beveled Subway Tile', 'Italian Travertine Navona Matte'],
    estimatedCostRange: '₹88 – ₹105 / sq.ft',
  },
  {
    id: 'insp-rustic-verandah',
    title: 'Kandanoor Sunset Verandah',
    roomType: 'Balcony & Verandah',
    subtitle: 'Earthy hexagonal terracotta tiles that evoke traditional Tamil Nadu homes',
    description: 'Rustic hexagonal slate terracotta floor tiles that age gracefully in tropical climates, paired with Salem flamed black granite step coping and stone parapet walls.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    style: 'Tamil Nadu Vernacular',
    colorPalette: ['#C86D51', '#29251F', '#F3EEE5'],
    productIds: ['prod-iahtt-001', 'prod-salem-granite'],
    productNames: ['Indian Autumn Slate Hexagon Terracotta', 'Salem Flamed Jet Black Granite'],
    estimatedCostRange: '₹85 – ₹145 / sq.ft',
  },
];
