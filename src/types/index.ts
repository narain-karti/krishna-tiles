export type PriceBasis = 'sqft' | 'sqm' | 'pack' | 'piece' | 'quote';

export type TileCategory = 'floor' | 'wall' | 'elevation' | 'outdoor' | 'mosaic' | 'border';

export type TileMaterial = 
  | 'vitrified' 
  | 'ceramic' 
  | 'porcelain' 
  | 'slate' 
  | 'granite' 
  | 'marble' 
  | 'natural-stone'
  | 'terracotta';

export type TileFinish = 
  | 'glossy' 
  | 'matte' 
  | 'satin' 
  | 'rustic' 
  | 'polished' 
  | 'flamed' 
  | 'carving'
  | 'sugar';

export type TilePatternType = 
  | 'marble' 
  | 'wood' 
  | 'stone' 
  | 'geometric' 
  | 'solid' 
  | 'terrazzo'
  | 'floral'
  | 'subway';

export type LayoutPattern = 'grid' | 'running-bond' | 'herringbone' | 'diagonal';

export interface ProductDimensions {
  widthMm: number;
  heightMm: number;
  thicknessMm?: number;
}

export interface TechnicalProperties {
  waterAbsorption?: string;
  frostResistance?: boolean;
  antiSkidRating?: string;
  breakingStrength?: string;
  surfaceHardnessMohs?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: TileCategory;
  material: TileMaterial;
  finish: TileFinish;
  patternType: TilePatternType;
  dimensions: ProductDimensions;
  primaryImage: string;
  textureImage?: string;
  priceBasis: PriceBasis;
  pricePerUnit?: number; // In INR (₹)
  packCoverageSqFt?: number;
  packCoverageSqM?: number;
  piecesPerPack?: number;
  minOrderQty?: number;
  available: boolean;
  isSampleRecord: boolean; // explicitly marked sample / starter record
  leadTimeDays?: number;
  description: string;
  applications: string[]; // 'living', 'kitchen', 'bathroom', 'bedroom', 'balcony', 'elevation', 'commercial'
  color: string;
  colorHex: string;
  accentColorHex?: string;
  technicalProperties?: TechnicalProperties;
  lastPriceUpdate?: string;
}

export interface OpeningDeduction {
  id: string;
  name: string;
  widthFt: number;
  heightFt: number;
}

export interface SurfaceZone {
  id: string;
  name: string;
  xPct: number; // 0 to 100 percentage inside surface
  yPct: number;
  widthPct: number;
  heightPct: number;
  assignedProductId?: string;
  customWastagePercentage?: number;
}

export type SurfaceType = 
  | 'floor' 
  | 'wall' 
  | 'backsplash' 
  | 'feature-wall' 
  | 'border' 
  | 'skirting' 
  | 'niche';

export interface Surface {
  id: string;
  name: string;
  surfaceType: SurfaceType;
  lengthFt: number;
  widthFt: number; // or height for walls
  openings: OpeningDeduction[];
  wastagePercentage: number; // e.g. 10 (%)
  assignedProductId?: string;
  layoutPattern: LayoutPattern;
  orientationDeg: number; // 0, 45, 90
  groutWidthMm: number; // 2, 3, 5
  groutColorHex: string;
  zones: SurfaceZone[];
}

export type RoomType = 
  | 'living' 
  | 'kitchen' 
  | 'bedroom' 
  | 'bathroom' 
  | 'balcony' 
  | 'terrace' 
  | 'staircase' 
  | 'exterior' 
  | 'commercial' 
  | 'custom';

export interface Room {
  id: string;
  name: string;
  roomType: RoomType;
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  surfaces: Surface[];
}

export interface ProjectEstimateOptions {
  includeAdhesive?: boolean;
  adhesiveBagCostINR?: number; // ~₹450 / 20kg bag covers 40 sqft
  includeGrout?: boolean;
  groutKgCostINR?: number; // ~₹120 / 1kg covers 50 sqft
  includeInstallationLabour?: boolean;
  labourRatePerSqFtINR?: number; // ~₹35 / sqft
}

export interface Project {
  id: string;
  title: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  targetBudget?: number; // in INR
  rooms: Room[];
  options: ProjectEstimateOptions;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface SurfaceCalculationResult {
  surfaceId: string;
  surfaceName: string;
  grossAreaSqFt: number;
  deductionAreaSqFt: number;
  netAreaSqFt: number;
  netAreaSqM: number;
  wastagePercentage: number;
  requiredAreaSqFt: number;
  requiredAreaSqM: number;
  assignedProduct?: Product;
  isQuoteRequired: boolean;
  priceBasis?: PriceBasis;
  unitPrice?: number;
  packsRequired?: number;
  piecesRequired?: number;
  materialCostINR: number;
  pricingStatus: 'calculated' | 'quote_required' | 'unassigned';
  missingFields: string[];
}

export interface RoomCalculationResult {
  roomId: string;
  roomName: string;
  totalAreaSqFt: number;
  totalMaterialCostINR: number;
  hasQuoteRequiredSurfaces: boolean;
  surfacesCalculations: SurfaceCalculationResult[];
}

export interface MaterialUsageSummary {
  product: Product;
  totalAreaSqFt: number;
  totalAreaSqM: number;
  totalPacksRequired?: number;
  totalPiecesRequired?: number;
  estimatedCostINR: number;
  isQuoteRequired: boolean;
  assignedSurfaceNames: { roomName: string; surfaceName: string }[];
}

export interface ProjectCalculationResult {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  configuredSurfacesCount: number;
  selectedProductsCount: number;
  materialSubtotalINR: number;
  adhesiveCostINR: number;
  groutCostINR: number;
  labourCostINR: number;
  accessoriesSubtotalINR: number;
  grandTotalINR: number;
  isComplete: boolean;
  incompleteReasons: string[];
  roomCalculations: RoomCalculationResult[];
  materialsSummary: MaterialUsageSummary[];
  targetBudget?: number;
  budgetStatus: 'within_budget' | 'over_budget' | 'no_budget_set';
  budgetDifferenceINR?: number;
}

export interface QuoteRequestSubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  locationCityOrPin: string;
  preferredContact: 'whatsapp' | 'phone' | 'email';
  customerNotes?: string;
  grandTotalINR: number;
  isCompleteEstimate: boolean;
  totalAreaSqFt: number;
  totalRoomsCount: number;
  totalSurfacesCount: number;
  materialsSnapshot: {
    sku: string;
    name: string;
    areaSqFt: number;
    packsRequired?: number;
    unitPrice?: number;
    subtotalINR?: number;
    isQuoteRequired: boolean;
  }[];
  roomsSnapshot: {
    roomName: string;
    surfaceName: string;
    tileName: string;
    areaSqFt: number;
    dimensions: string;
  }[];
  status: 'new' | 'contacted' | 'quote_prepared' | 'awaiting_customer' | 'confirmed' | 'closed';
  createdAt: string;
  adminNotes?: string;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  region: string;
  googleMapsUrl: string;
  gstin: string;
  showroomHours: string;
  defaultWastagePercentage: number;
  quoteExpiryDays: number;
  verifiedStockNotice: string;
}
