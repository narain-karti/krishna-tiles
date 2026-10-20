import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { formatINR } from '../../utils/calculator';
import { 
  ChevronUp, 
  ChevronDown, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight,
  X
} from 'lucide-react';

interface PersistentEstimateDockProps {
  onRequestQuote: () => void;
}

export const PersistentEstimateDock: React.FC<PersistentEstimateDockProps> = ({
  onRequestQuote,
}) => {
  const { 
    project, 
    calculationResult, 
    updateProjectDetails 
  } = useProject();

  const [isExpanded, setIsExpanded] = useState(false);

  const {
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
  } = calculationResult;

  const options = project.options;

  return (
    <>
      {/* Expanded Breakdown Drawer / Sheet */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end justify-center">
          <div className="bg-white rounded-t-4xl max-w-4xl w-full p-6 sm:p-8 max-h-[80vh] overflow-y-auto shadow-modal border-t border-border space-y-6">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-xl font-extrabold text-carbon">
                  Itemized Project Tile Estimate
                </h3>
                <p className="text-xs text-muted">
                  Full multi-room surface breakdown with optional accessories and Tamil Nadu delivery considerations.
                </p>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-muted hover:text-carbon rounded-full hover:bg-stone-light/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Room by Room Table */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-carbon">
                Configured Rooms ({calculationResult.roomCalculations.length})
              </h4>

              <div className="border border-border rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#F6F6F8] text-muted border-b border-border font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Space & Surface</th>
                      <th className="p-3">Tile Product</th>
                      <th className="p-3 text-right">Net Area</th>
                      <th className="p-3 text-right">Procurement</th>
                      <th className="p-3 text-right">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {calculationResult.roomCalculations.map((room) => (
                      <React.Fragment key={room.roomId}>
                        <tr className="bg-stone-light/30 font-bold text-carbon">
                          <td colSpan={4} className="p-2.5 px-3">
                            {room.roomName}
                          </td>
                          <td className="p-2.5 px-3 text-right font-mono">
                            {formatINR(room.totalMaterialCostINR)}
                          </td>
                        </tr>
                        {room.surfacesCalculations.map((s) => (
                          <tr key={s.surfaceId} className="hover:bg-white/80">
                            <td className="p-2.5 px-3 pl-6 text-carbon font-medium">
                              {s.surfaceName}
                            </td>
                            <td className="p-2.5 px-3 text-muted">
                              {s.assignedProduct ? (
                                <span className="text-carbon font-medium">
                                  {s.assignedProduct.name} ({s.assignedProduct.sku})
                                </span>
                              ) : (
                                <span className="text-amber-600 italic">No tile assigned</span>
                              )}
                            </td>
                            <td className="p-2.5 px-3 text-right font-mono">
                              {s.netAreaSqFt} sq.ft
                            </td>
                            <td className="p-2.5 px-3 text-right font-mono text-muted">
                              {s.requiredAreaSqFt} sq.ft {s.packsRequired && `(${s.packsRequired} bxs)`}
                            </td>
                            <td className="p-2.5 px-3 text-right font-mono font-bold text-carbon">
                              {s.isQuoteRequired ? (
                                <span className="text-amber-700">Quote Req.</span>
                              ) : (
                                formatINR(s.materialCostINR)
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Optional Accessories Configuration */}
            <div className="bg-[#F8F8FA] p-5 rounded-2xl border border-border space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-carbon block">
                Optional Accessories & Site Preparation
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Adhesive */}
                <label className="flex items-start space-x-2.5 cursor-pointer p-3 bg-white rounded-xl border border-border hover:border-carbon transition-colors">
                  <input
                    type="checkbox"
                    checked={!!options.includeAdhesive}
                    onChange={(e) => updateProjectDetails({
                      options: { ...options, includeAdhesive: e.target.checked }
                    })}
                    className="mt-0.5 rounded text-carbon focus:ring-neon"
                  />
                  <div>
                    <span className="font-bold text-carbon block">Tile Adhesive ({formatINR(adhesiveCostINR)})</span>
                    <span className="text-[11px] text-muted">₹450/20kg bag (~40 sq.ft)</span>
                  </div>
                </label>

                {/* Grout */}
                <label className="flex items-start space-x-2.5 cursor-pointer p-3 bg-white rounded-xl border border-border hover:border-carbon transition-colors">
                  <input
                    type="checkbox"
                    checked={!!options.includeGrout}
                    onChange={(e) => updateProjectDetails({
                      options: { ...options, includeGrout: e.target.checked }
                    })}
                    className="mt-0.5 rounded text-carbon focus:ring-neon"
                  />
                  <div>
                    <span className="font-bold text-carbon block">Polymer Grout ({formatINR(groutCostINR)})</span>
                    <span className="text-[11px] text-muted">₹120/1kg (~50 sq.ft)</span>
                  </div>
                </label>

                {/* Labour */}
                <label className="flex items-start space-x-2.5 cursor-pointer p-3 bg-white rounded-xl border border-border hover:border-carbon transition-colors">
                  <input
                    type="checkbox"
                    checked={!!options.includeInstallationLabour}
                    onChange={(e) => updateProjectDetails({
                      options: { ...options, includeInstallationLabour: e.target.checked }
                    })}
                    className="mt-0.5 rounded text-carbon focus:ring-neon"
                  />
                  <div>
                    <span className="font-bold text-carbon block">Installation Labour ({formatINR(labourCostINR)})</span>
                    <span className="text-[11px] text-muted">₹35/sq.ft Salem rate</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Total Summary Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-4">
              <div className="text-xs text-muted">
                Calculations include whole-box rounding and cutting wastage margins.
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs text-muted block uppercase font-mono font-medium">Grand Total</span>
                  <span className="text-2xl font-extrabold text-carbon font-mono">
                    {formatINR(grandTotalINR)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onRequestQuote();
                  }}
                  className="px-6 py-3 bg-neon hover:bg-neon-light text-carbon font-extrabold rounded-full text-xs shadow-neon-glow transition-all"
                >
                  Request Store Quote
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Persistent Dock Bar (Deep Carbon with Neon Accents) */}
      <div className="bg-carbon text-white border-t border-carbon-border px-4 sm:px-8 py-3 flex items-center justify-between z-30 select-none shadow-elevated">
        {/* Left Stats */}
        <div className="flex items-center space-x-6 text-xs">
          <div>
            <span className="text-[10px] text-muted-light uppercase tracking-wider block font-mono">Total Area</span>
            <span className="font-bold text-white">
              {totalAreaSqFt} sq.ft <span className="text-stone-dark font-normal text-[10px]">({totalAreaSqM} m²)</span>
            </span>
          </div>

          <div className="hidden sm:block">
            <span className="text-[10px] text-muted-light uppercase tracking-wider block font-mono">Configured</span>
            <span className="font-bold text-white">
              {configuredSurfacesCount} Surfaces • {selectedProductsCount} Tiles
            </span>
          </div>

          <div className="hidden md:block">
            <span className="text-[10px] text-muted-light uppercase tracking-wider block font-mono">Tile Materials</span>
            <span className="font-bold text-white font-mono">
              {formatINR(materialSubtotalINR)}
            </span>
          </div>

          {accessoriesSubtotalINR > 0 && (
            <div className="hidden lg:block">
              <span className="text-[10px] text-muted-light uppercase tracking-wider block font-mono">Adhesives & Extras</span>
              <span className="font-bold text-neon font-mono">
                +{formatINR(accessoriesSubtotalINR)}
              </span>
            </div>
          )}
        </div>

        {/* Right CTA and Total */}
        <div className="flex items-center space-x-4">
          {!isComplete ? (
            <div className="text-right hidden sm:block">
              <span className="inline-flex items-center text-xs text-amber-300 font-bold">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> Partial Estimate
              </span>
              <span className="text-[10px] text-stone-dark block">Requires quote confirmation</span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-[10px] text-muted-light uppercase tracking-wider block font-mono">Total Investment</span>
              <span className="text-lg sm:text-xl font-extrabold text-neon font-mono">
                {formatINR(grandTotalINR)}
              </span>
            </div>
          )}

          {/* Expand Details Trigger */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-carbon-card hover:bg-carbon-surface text-xs text-stone hover:text-white border border-carbon-border transition-colors font-medium"
          >
            <span>Breakdown</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* Request Quote Button (Neon Green Pill with Arrow) */}
          <button
            onClick={onRequestQuote}
            className="flex items-center space-x-2 bg-neon hover:bg-neon-light text-carbon font-extrabold px-5 py-2 rounded-full text-xs shadow-neon-glow hover:scale-105 transition-all group whitespace-nowrap"
          >
            <span>Get Quote</span>
            <div className="w-4 h-4 rounded-full bg-carbon text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
              <ArrowUpRight className="w-2.5 h-2.5" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
};
