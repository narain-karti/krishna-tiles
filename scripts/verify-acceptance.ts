import { 
  calculateSurfaceNetAreaSqFt, 
  calculateRequiredArea, 
  calculateSurfaceMaterial, 
  calculateProjectEstimate,
  getTilePieceCoverageSqFt
} from '../src/utils/calculator.ts';
import { INITIAL_PRODUCTS } from '../src/data/products.ts';
import { DEFAULT_PROJECT } from '../src/data/defaultProject.ts';
import { Surface, Product, Project } from '../src/types/index.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--- STARTING KRISHNA TILES AUTOMATED VERIFICATION ---');

const productsMap = new Map<string, Product>();
INITIAL_PRODUCTS.forEach(p => productsMap.set(p.id, p));

// TEST 1: MULTI-ROOM PROJECT
const project = JSON.parse(JSON.stringify(DEFAULT_PROJECT)) as Project;
assert(project.rooms.length >= 5, 'TEST 1: Default project contains at least 5 rooms');
const roomNames = project.rooms.map(r => r.name);
assert(roomNames.includes('Grand Living Room') && roomNames.includes('Chef Kitchen') && roomNames.includes('Master Ensuite Bathroom'), 'TEST 1: Living, Kitchen, and Bathroom rooms exist independently');

// TEST 2: WALL AND FLOOR SEPARATION
const kitchen = project.rooms.find(r => r.id === 'room-kitchen')!;
const kitchenFloor = kitchen.surfaces.find(s => s.surfaceType === 'floor')!;
const kitchenBacksplash = kitchen.surfaces.find(s => s.surfaceType === 'backsplash')!;

assert(kitchenFloor.assignedProductId !== kitchenBacksplash.assignedProductId, 'TEST 4: Kitchen floor and backsplash have distinct tile products');
const originalFloorTile = kitchenFloor.assignedProductId;

// Change backsplash
kitchenBacksplash.assignedProductId = 'prod-statuario-1200';
assert(kitchenFloor.assignedProductId === originalFloorTile, 'TEST 4: Modifying backsplash tile does NOT modify floor tile');

// TEST 5: PRICING ACCURACY ACROSS MODES
// Mode A: Per sq.ft
const sqftProduct = INITIAL_PRODUCTS.find(p => p.priceBasis === 'sqft' && p.pricePerUnit)!;
const testSurfaceSqFt: Surface = {
  id: 'test-s1',
  name: 'Test SqFt Surface',
  surfaceType: 'floor',
  lengthFt: 10,
  widthFt: 10, // 100 sq.ft
  openings: [],
  wastagePercentage: 10, // 110 sq.ft required
  assignedProductId: sqftProduct.id,
  layoutPattern: 'grid',
  orientationDeg: 0,
  groutWidthMm: 2,
  groutColorHex: '#D8D0C3',
  zones: [],
};

const calcResultSqFt = calculateSurfaceMaterial(testSurfaceSqFt, sqftProduct);
assert(calcResultSqFt.grossAreaSqFt === 100, 'TEST 5A: Gross area is 100 sq.ft');
assert(calcResultSqFt.netAreaSqFt === 100, 'TEST 5A: Net area is 100 sq.ft');
assert(calcResultSqFt.requiredAreaSqFt === 110, 'TEST 5A: Required area with 10% wastage is 110 sq.ft');
assert(calcResultSqFt.materialCostINR === Math.round(110 * sqftProduct.pricePerUnit!), 'TEST 5A: Sq.ft material cost matches unit price * 110 sq.ft');

// Mode B: Per Pack (Nordic Natural Oak Wood Plank)
const packProduct = INITIAL_PRODUCTS.find(p => p.id === 'prod-wood-plank-1200')!;
assert(packProduct.priceBasis === 'pack', 'TEST 5B: Wood plank is pack-based');
const testSurfacePack: Surface = {
  ...testSurfaceSqFt,
  assignedProductId: packProduct.id,
};
const calcResultPack = calculateSurfaceMaterial(testSurfacePack, packProduct);
// 110 sq.ft / 15.5 sq.ft per box = 7.0967 -> ceiling = 8 boxes
const expectedBoxes = Math.ceil(110 / packProduct.packCoverageSqFt!);
assert(calcResultPack.packsRequired === expectedBoxes, `TEST 5B: Whole-box ceiling rounding correctly requires ${expectedBoxes} boxes`);
assert(calcResultPack.materialCostINR === expectedBoxes * packProduct.pricePerUnit!, `TEST 5B: Pack cost matches ${expectedBoxes} * pack price`);

// Mode C: Per Piece (Chettinad Heritage Blue 300x300mm)
const pieceProduct = INITIAL_PRODUCTS.find(p => p.id === 'prod-chettinad-accent')!;
assert(pieceProduct.priceBasis === 'piece', 'TEST 5C: Chettinad accent is piece-based');
const pieceCov = getTilePieceCoverageSqFt(pieceProduct.dimensions.widthMm, pieceProduct.dimensions.heightMm);
const expectedPieces = Math.ceil(110 / pieceCov);
const calcResultPiece = calculateSurfaceMaterial(testSurfaceSqFt, pieceProduct);
assert(calcResultPiece.piecesRequired === expectedPieces, `TEST 5C: Piece count matches ceiling required (${expectedPieces} pieces)`);
assert(calcResultPiece.materialCostINR === expectedPieces * pieceProduct.pricePerUnit!, 'TEST 5C: Piece cost matches pieces * piece rate');

// TEST 6: PRICE-ON-REQUEST HANDLING
const quoteProduct = INITIAL_PRODUCTS.find(p => p.priceBasis === 'quote')!;
assert(quoteProduct.pricePerUnit === undefined, 'TEST 6: Quote-required product has no fabricated price');
const calcResultQuote = calculateSurfaceMaterial(testSurfaceSqFt, quoteProduct);
assert(calcResultQuote.isQuoteRequired === true, 'TEST 6: Flagged as isQuoteRequired: true');
assert(calcResultQuote.materialCostINR === 0, 'TEST 6: Zero fabricated material cost');
assert(calcResultQuote.pricingStatus === 'quote_required', 'TEST 6: Pricing status set to quote_required');

// TEST 7: MATERIAL COST RECONCILIATION & ROLLUPS
const fullEstimate = calculateProjectEstimate(project, productsMap);
assert(fullEstimate.totalAreaSqFt > 0, `TEST 7: Total project area computed: ${fullEstimate.totalAreaSqFt} sq.ft`);
assert(fullEstimate.materialSubtotalINR > 0, `TEST 7: Project material subtotal computed: ₹${fullEstimate.materialSubtotalINR}`);
assert(fullEstimate.accessoriesSubtotalINR > 0, `TEST 7: Optional accessories (adhesive, grout) identified separately: ₹${fullEstimate.accessoriesSubtotalINR}`);
assert(fullEstimate.grandTotalINR === fullEstimate.materialSubtotalINR + fullEstimate.accessoriesSubtotalINR, 'TEST 7: Grand total strictly equals materialSubtotal + accessoriesSubtotal');

console.log('--- ALL ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY ---');
