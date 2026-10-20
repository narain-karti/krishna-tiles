import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { formatINR } from '../../utils/calculator';
import { getTileBackgroundStyle } from '../../utils/tileRenderer';
import { Layers, ArrowRight, AlertCircle, CheckCircle2, Package, Ruler, ShieldCheck } from 'lucide-react';

export const MaterialBoardCanvas: React.FC = () => {
  const { 
    calculationResult, 
    project, 
    setActiveRoomId, 
    setActiveSurfaceId, 
    setActiveViewMode 
  } = useProject();

  const materials = calculationResult.materialsSummary;

  return (
    <div className="relative flex flex-col h-full w-full bg-[#EDE8DF] select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-border/80 sticky top-0 z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-charcoal text-ivory rounded-md">
              Material Specification Board
            </span>
            <span className="text-sm font-serif font-medium text-charcoal">
              {project.title}
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Aggregated procurement breakdown for {materials.length} distinct architectural tiles across {calculationResult.configuredSurfacesCount} surfaces.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-muted">Estimated Materials Subtotal</div>
          <div className="text-lg font-serif font-bold text-charcoal">
            {formatINR(calculationResult.materialSubtotalINR)}
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="p-8 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {materials.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40 text-charcoal" />
            <p className="text-base font-serif">No tiles configured in this project yet.</p>
            <p className="text-xs mt-1">Assign tiles in the Room Preview or Catalogue to populate the material board.</p>
          </div>
        ) : (
          materials.map((item) => {
            const { product, totalAreaSqFt, totalAreaSqM, totalPacksRequired, estimatedCostINR, isQuoteRequired, assignedSurfaceNames } = item;
            
            const swatchStyle = getTileBackgroundStyle(product, 'grid', 2, '#D8D0C3', 0);

            return (
              <div 
                key={product.id}
                className="bg-white rounded-2xl p-6 border border-border shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Product Header */}
                  <div className="flex items-start space-x-4">
                    {/* Architectural Swatch */}
                    <div 
                      className="w-20 h-20 rounded-xl border border-border shadow-inner shrink-0 relative overflow-hidden"
                      style={{
                        ...swatchStyle,
                        backgroundSize: '40px 40px',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted font-medium bg-ivory px-2 py-0.5 rounded">
                          {product.sku}
                        </span>
                        {isQuoteRequired ? (
                          <span className="inline-flex items-center text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <AlertCircle className="w-3 h-3 mr-1" /> Price on Request
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-charcoal">
                            {formatINR(product.pricePerUnit || 0)} / {product.priceBasis}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold text-charcoal mt-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted">
                        {product.brand} • {product.dimensions.widthMm} × {product.dimensions.heightMm} mm
                      </p>
                    </div>
                  </div>

                  {/* Badges / Specs */}
                  <div className="flex flex-wrap gap-1.5 mt-4 text-[11px]">
                    <span className="bg-ivory text-charcoal px-2 py-0.5 rounded capitalize">
                      {product.material}
                    </span>
                    <span className="bg-ivory text-charcoal px-2 py-0.5 rounded capitalize">
                      {product.finish} finish
                    </span>
                    <span className="bg-ivory text-charcoal px-2 py-0.5 rounded capitalize">
                      {product.category}
                    </span>
                    {product.technicalProperties?.antiSkidRating && (
                      <span className="bg-stone-light text-charcoal px-2 py-0.5 rounded">
                        {product.technicalProperties.antiSkidRating}
                      </span>
                    )}
                  </div>

                  {/* Surface Allocation Tags */}
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <div className="text-[11px] text-muted font-medium uppercase tracking-wider mb-2">
                      Assigned Locations ({assignedSurfaceNames.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {assignedSurfaceNames.map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const targetRoom = project.rooms.find(r => r.name === loc.roomName);
                            if (targetRoom) {
                              setActiveRoomId(targetRoom.id);
                              const targetSurf = targetRoom.surfaces.find(s => s.name === loc.surfaceName);
                              if (targetSurf) setActiveSurfaceId(targetSurf.id);
                              setActiveViewMode('room_preview');
                            }
                          }}
                          className="inline-flex items-center space-x-1 text-xs bg-[#F7F4EE] hover:bg-brass/20 text-charcoal px-2.5 py-1 rounded-md border border-border/80 transition-colors"
                          title="Click to view this surface in 3D"
                        >
                          <span>{loc.roomName} → {loc.surfaceName}</span>
                          <ArrowRight className="w-3 h-3 text-muted" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Procurement Metrics Footer */}
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">Required Coverage</span>
                    <span className="font-semibold text-charcoal">
                      {totalAreaSqFt} sq.ft <span className="text-muted font-normal">({totalAreaSqM} m²)</span>
                    </span>
                    {totalPacksRequired && (
                      <span className="text-muted ml-2 font-mono">
                        ({totalPacksRequired} {product.priceBasis === 'piece' ? 'pieces' : 'boxes'})
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-muted block text-[10px] uppercase tracking-wider">Estimated Cost</span>
                    <span className="text-sm font-bold text-charcoal font-serif">
                      {isQuoteRequired ? 'Enquiry Required' : formatINR(estimatedCostINR)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
