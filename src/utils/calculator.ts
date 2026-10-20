import { 
  Surface, 
  Product, 
  Room, 
  Project, 
  SurfaceCalculationResult, 
  RoomCalculationResult, 
  MaterialUsageSummary, 
  ProjectCalculationResult, 
  ProjectEstimateOptions 
} from '../types';

export const SQFT_PER_SQM = 10.7639104;

/**
 * Calculates net surface area in square feet after subtracting opening deductions (doors, windows).
 */
export function calculateSurfaceNetAreaSqFt(surface: Surface): {
  grossAreaSqFt: number;
  deductionAreaSqFt: number;
  netAreaSqFt: number;
  netAreaSqM: number;
} {
  const grossAreaSqFt = Math.max(0, surface.lengthFt * surface.widthFt);
  
  const deductionAreaSqFt = (surface.openings || []).reduce((acc, opening) => {
    return acc + Math.max(0, opening.widthFt * opening.heightFt);
  }, 0);

  const netAreaSqFt = Math.max(0, Number((grossAreaSqFt - deductionAreaSqFt).toFixed(2)));
  const netAreaSqM = Number((netAreaSqFt / SQFT_PER_SQM).toFixed(3));

  return { grossAreaSqFt, deductionAreaSqFt, netAreaSqFt, netAreaSqM };
}

/**
 * Calculates required area including wastage percentage.
 */
export function calculateRequiredArea(netAreaSqFt: number, wastagePercentage: number): {
  requiredAreaSqFt: number;
  requiredAreaSqM: number;
} {
  const safeWastage = Math.max(0, wastagePercentage || 0);
  const requiredAreaSqFt = Number((netAreaSqFt * (1 + safeWastage / 100)).toFixed(2));
  const requiredAreaSqM = Number((requiredAreaSqFt / SQFT_PER_SQM).toFixed(3));
  return { requiredAreaSqFt, requiredAreaSqM };
}

/**
 * Calculates single tile coverage in square feet from millimetre dimensions.
 */
export function getTilePieceCoverageSqFt(widthMm: number, heightMm: number): number {
  if (!widthMm || !heightMm || widthMm <= 0 || heightMm <= 0) return 1;
  // 1 ft = 304.8 mm; 1 sq ft = 92903.04 mm²
  return (widthMm * heightMm) / 92903.04;
}

/**
 * Detailed material calculation for a single surface.
 */
export function calculateSurfaceMaterial(
  surface: Surface,
  product?: Product
): SurfaceCalculationResult {
  const { grossAreaSqFt, deductionAreaSqFt, netAreaSqFt, netAreaSqM } = calculateSurfaceNetAreaSqFt(surface);
  const { requiredAreaSqFt, requiredAreaSqM } = calculateRequiredArea(netAreaSqFt, surface.wastagePercentage);

  const missingFields: string[] = [];

  if (!product) {
    return {
      surfaceId: surface.id,
      surfaceName: surface.name,
      grossAreaSqFt,
      deductionAreaSqFt,
      netAreaSqFt,
      netAreaSqM,
      wastagePercentage: surface.wastagePercentage,
      requiredAreaSqFt,
      requiredAreaSqM,
      isQuoteRequired: false,
      materialCostINR: 0,
      pricingStatus: 'unassigned',
      missingFields: ['No tile selected'],
    };
  }

  // Handle Price on Request
  if (product.priceBasis === 'quote' || product.pricePerUnit === undefined || product.pricePerUnit === null) {
    return {
      surfaceId: surface.id,
      surfaceName: surface.name,
      grossAreaSqFt,
      deductionAreaSqFt,
      netAreaSqFt,
      netAreaSqM,
      wastagePercentage: surface.wastagePercentage,
      requiredAreaSqFt,
      requiredAreaSqM,
      assignedProduct: product,
      isQuoteRequired: true,
      priceBasis: 'quote',
      materialCostINR: 0,
      pricingStatus: 'quote_required',
      missingFields: ['Price on request — requires showroom quotation confirmation'],
    };
  }

  let materialCostINR = 0;
  let packsRequired: number | undefined = undefined;
  let piecesRequired: number | undefined = undefined;

  switch (product.priceBasis) {
    case 'sqft': {
      materialCostINR = Math.round(requiredAreaSqFt * product.pricePerUnit);
      if (product.packCoverageSqFt && product.packCoverageSqFt > 0) {
        packsRequired = Math.ceil(requiredAreaSqFt / product.packCoverageSqFt);
      }
      break;
    }

    case 'sqm': {
      materialCostINR = Math.round(requiredAreaSqM * product.pricePerUnit);
      if (product.packCoverageSqM && product.packCoverageSqM > 0) {
        packsRequired = Math.ceil(requiredAreaSqM / product.packCoverageSqM);
      } else if (product.packCoverageSqFt && product.packCoverageSqFt > 0) {
        packsRequired = Math.ceil(requiredAreaSqFt / product.packCoverageSqFt);
      }
      break;
    }

    case 'pack': {
      const packCoverage = product.packCoverageSqFt || 
        (product.packCoverageSqM ? product.packCoverageSqM * SQFT_PER_SQM : undefined);

      if (!packCoverage || packCoverage <= 0) {
        missingFields.push('Pack coverage data missing for pack-priced tile');
        materialCostINR = 0;
      } else {
        packsRequired = Math.ceil(requiredAreaSqFt / packCoverage);
        materialCostINR = Math.round(packsRequired * product.pricePerUnit);
      }
      break;
    }

    case 'piece': {
      const pieceCoverage = getTilePieceCoverageSqFt(
        product.dimensions.widthMm, 
        product.dimensions.heightMm
      );
      piecesRequired = Math.ceil(requiredAreaSqFt / pieceCoverage);
      materialCostINR = Math.round(piecesRequired * product.pricePerUnit);
      if (product.piecesPerPack && product.piecesPerPack > 0) {
        packsRequired = Math.ceil(piecesRequired / product.piecesPerPack);
      }
      break;
    }
  }

  return {
    surfaceId: surface.id,
    surfaceName: surface.name,
    grossAreaSqFt,
    deductionAreaSqFt,
    netAreaSqFt,
    netAreaSqM,
    wastagePercentage: surface.wastagePercentage,
    requiredAreaSqFt,
    requiredAreaSqM,
    assignedProduct: product,
    isQuoteRequired: false,
    priceBasis: product.priceBasis,
    unitPrice: product.pricePerUnit,
    packsRequired,
    piecesRequired,
    materialCostINR,
    pricingStatus: 'calculated',
    missingFields,
  };
}

/**
 * Calculates full room estimate by aggregating all surfaces.
 */
export function calculateRoomEstimate(
  room: Room,
  productsMap: Map<string, Product>
): RoomCalculationResult {
  const surfacesCalculations: SurfaceCalculationResult[] = room.surfaces.map(surface => {
    const product = surface.assignedProductId ? productsMap.get(surface.assignedProductId) : undefined;
    return calculateSurfaceMaterial(surface, product);
  });

  const totalAreaSqFt = Number(
    surfacesCalculations.reduce((acc, s) => acc + s.netAreaSqFt, 0).toFixed(2)
  );

  const totalMaterialCostINR = surfacesCalculations.reduce((acc, s) => acc + s.materialCostINR, 0);
  const hasQuoteRequiredSurfaces = surfacesCalculations.some(s => s.isQuoteRequired);

  return {
    roomId: room.id,
    roomName: room.name,
    totalAreaSqFt,
    totalMaterialCostINR,
    hasQuoteRequiredSurfaces,
    surfacesCalculations,
  };
}

/**
 * Calculates complete project estimates, material summaries, optional accessories, and budget checks.
 */
export function calculateProjectEstimate(
  project: Project,
  productsMap: Map<string, Product>,
  optionsOverride?: Partial<ProjectEstimateOptions>
): ProjectCalculationResult {
  const options: ProjectEstimateOptions = {
    ...project.options,
    ...optionsOverride,
  };

  const roomCalculations: RoomCalculationResult[] = project.rooms.map(room => 
    calculateRoomEstimate(room, productsMap)
  );

  const totalAreaSqFt = Number(
    roomCalculations.reduce((acc, r) => acc + r.totalAreaSqFt, 0).toFixed(2)
  );
  const totalAreaSqM = Number((totalAreaSqFt / SQFT_PER_SQM).toFixed(2));

  let configuredSurfacesCount = 0;
  let materialSubtotalINR = 0;
  const incompleteReasons: string[] = [];

  // Group materials summary by product
  const materialMap = new Map<string, MaterialUsageSummary>();

  for (const roomCalc of roomCalculations) {
    for (const surfaceCalc of roomCalc.surfacesCalculations) {
      if (surfaceCalc.pricingStatus !== 'unassigned') {
        configuredSurfacesCount++;
      }

      if (surfaceCalc.isQuoteRequired) {
        if (!incompleteReasons.includes('Contains tiles with Price on Request (requires store quote)')) {
          incompleteReasons.push('Contains tiles with Price on Request (requires store quote)');
        }
      }

      if (surfaceCalc.missingFields.length > 0) {
        for (const field of surfaceCalc.missingFields) {
          if (!incompleteReasons.includes(field)) incompleteReasons.push(field);
        }
      }

      materialSubtotalINR += surfaceCalc.materialCostINR;

      if (surfaceCalc.assignedProduct) {
        const prodId = surfaceCalc.assignedProduct.id;
        const existing = materialMap.get(prodId);

        if (existing) {
          existing.totalAreaSqFt += surfaceCalc.requiredAreaSqFt;
          existing.totalAreaSqM = Number((existing.totalAreaSqFt / SQFT_PER_SQM).toFixed(2));
          existing.estimatedCostINR += surfaceCalc.materialCostINR;
          if (surfaceCalc.packsRequired) {
            existing.totalPacksRequired = (existing.totalPacksRequired || 0) + surfaceCalc.packsRequired;
          }
          if (surfaceCalc.piecesRequired) {
            existing.totalPiecesRequired = (existing.totalPiecesRequired || 0) + surfaceCalc.piecesRequired;
          }
          existing.assignedSurfaceNames.push({
            roomName: roomCalc.roomName,
            surfaceName: surfaceCalc.surfaceName,
          });
        } else {
          materialMap.set(prodId, {
            product: surfaceCalc.assignedProduct,
            totalAreaSqFt: surfaceCalc.requiredAreaSqFt,
            totalAreaSqM: surfaceCalc.requiredAreaSqM,
            totalPacksRequired: surfaceCalc.packsRequired,
            totalPiecesRequired: surfaceCalc.piecesRequired,
            estimatedCostINR: surfaceCalc.materialCostINR,
            isQuoteRequired: surfaceCalc.isQuoteRequired,
            assignedSurfaceNames: [{
              roomName: roomCalc.roomName,
              surfaceName: surfaceCalc.surfaceName,
            }],
          });
        }
      }
    }
  }

  // Recalculate whole-pack pooling for the same product across multiple surfaces if pack-based
  for (const [, summary] of materialMap.entries()) {
    if (summary.product.packCoverageSqFt && summary.product.packCoverageSqFt > 0) {
      // Pooled pack coverage across the whole project
      summary.totalPacksRequired = Math.ceil(summary.totalAreaSqFt / summary.product.packCoverageSqFt);
      if (summary.product.priceBasis === 'pack' && summary.product.pricePerUnit) {
        summary.estimatedCostINR = summary.totalPacksRequired * summary.product.pricePerUnit;
      }
    }
  }

  // Re-sum pooled material cost if any pack-based products were optimized
  const materialsSummary = Array.from(materialMap.values());
  const selectedProductsCount = materialsSummary.length;

  // Optional accessories calculations
  let adhesiveCostINR = 0;
  if (options.includeAdhesive && totalAreaSqFt > 0) {
    const bagCost = options.adhesiveBagCostINR || 450;
    const bagsRequired = Math.ceil(totalAreaSqFt / 40); // 1 bag per 40 sqft
    adhesiveCostINR = bagsRequired * bagCost;
  }

  let groutCostINR = 0;
  if (options.includeGrout && totalAreaSqFt > 0) {
    const kgCost = options.groutKgCostINR || 120;
    const kgRequired = Math.ceil(totalAreaSqFt / 50); // 1 kg per 50 sqft
    groutCostINR = kgRequired * kgCost;
  }

  let labourCostINR = 0;
  if (options.includeInstallationLabour && totalAreaSqFt > 0) {
    const rate = options.labourRatePerSqFtINR || 35; // ₹35 per sqft
    labourCostINR = Math.round(totalAreaSqFt * rate);
  }

  const accessoriesSubtotalINR = adhesiveCostINR + groutCostINR + labourCostINR;
  const grandTotalINR = materialSubtotalINR + accessoriesSubtotalINR;

  const isComplete = incompleteReasons.length === 0 && configuredSurfacesCount > 0;

  // Budget status
  let budgetStatus: 'within_budget' | 'over_budget' | 'no_budget_set' = 'no_budget_set';
  let budgetDifferenceINR: number | undefined = undefined;

  if (project.targetBudget && project.targetBudget > 0) {
    budgetDifferenceINR = project.targetBudget - grandTotalINR;
    budgetStatus = budgetDifferenceINR >= 0 ? 'within_budget' : 'over_budget';
  }

  return {
    totalAreaSqFt,
    totalAreaSqM,
    configuredSurfacesCount,
    selectedProductsCount,
    materialSubtotalINR,
    adhesiveCostINR,
    groutCostINR,
    labourCostINR,
    accessoriesSubtotalINR,
    grandTotalINR,
    isComplete,
    incompleteReasons,
    roomCalculations,
    materialsSummary,
    targetBudget: project.targetBudget,
    budgetStatus,
    budgetDifferenceINR,
  };
}

/**
 * Currency formatter for Indian Rupees (₹) with comma separators.
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === undefined || amount === null) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}
