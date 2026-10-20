import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { formatINR } from '../../utils/calculator';
import { 
  ChevronUp, 
  ChevronDown, 
  FileText, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  ShieldCheck, 
  Sparkles,
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
    incompleteReasons,
  } = calculationResult;

  const options = project.options;

  return (
    <>
      {/* Expanded Breakdown Drawer / Sheet */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl max-w-4xl w-full p-6 max-h-[80vh] overflow-y-auto shadow-modal border-t border-border space-y-6">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-serif font-bold text-charcoal">
                  Itemized Project Tile Estimate
                </h3>
                <p className="text-xs text-muted">
                  Full multi-room surface breakdown with optional accessories and Tamil Nadu delivery considerations.
                </p>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 text-muted hover:text-charcoal rounded-lg hover:bg-stone-light/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Room by Room Table */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                Configured Rooms ({calculationResult.roomCalculations.length})
              </h4>

              <div className="border border-border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-porcelain text-muted border-b border-border font-medium">
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
                        <tr className="bg-ivory/40 font-semibold text-charcoal">
                          <td colSpan={4} className="p-2.5 px-3">
                            {room.roomName}
                          </td>
                          <td className="p-2.5 px-3 text-right font-mono">
                            {formatINR(room.totalMaterialCostINR)}
                          </td>
                        </tr>
                        {room.surfacesCalculations.map((s) => (
                          <tr key={s.surfaceId} className="hover:bg-porcelain/60">
                            <td className="p-2.5 px-3 pl-6 text-charcoal">
                              {s.surfaceName}
                            </td>
                            <td className="p-2.5 px-3 text-muted">
                              {s.assignedProduct ? (
                                <span className="text-charcoal font-medium">
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
                            <td className="p-2.5 px-3 text-right font-mono font-medium text-charcoal">
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
            <div className="bg-ivory-light p-4 rounded-xl border border-border space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal block">
                Optional Accessories & Site Preparation
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Adhesive */}
                <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 bg-white rounded-lg border border-border">
                  <input
                    type="checkbox"
                    checked={!!options.includeAdhesive}
                    onChange={(e) => updateProjectDetails({
                      options: { ...options, includeAdhesive: e.target.checked }
                    })}
                    className="mt-0.5 rounded text-brass focus:ring-brass"
                  />
                  <div>
                    <span className="font-semibold text-charcoal block">Tile Adhesive ({formatINR(adhesiveCostINR)})</span>
                    <span className="text-[11px] text-muted">₹450/20kg bag (covers ~40 sq.ft)</span>
                  </div>
                </label>

                {/* Grout */}
                <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 bg-white rounded-lg border border-border">
                  <input
                    type="checkbox"
                    checked={!!options.includeGrout}
                    onChange={(e) => updateProjectDetails({
                      options: { ...options, includeGrout: e.target.checked }
                    })}
                    className="mt-0.5 rounded text-brass focus:ring-brass"
                  />
                  <div>
                    <span className="font-semibold text-charcoal block">Epoxy / Polymer Grout ({formatINR(groutCostINR)})</span>
                    <span className="text-[11px] text-muted">₹120/1kg (covers ~50 sq.ft)</span>
                  </div>
                </label>

                {/* Labour */}
                <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 bg-white rounded-lg border border-border">
                  <input
                    type="checkbox"
                    checked={!!options.includeInstallationLabour}
                    onChange={(e) => updateProjectDetails({
                      options: { ...options, includeInstallationLabour: e.target.checked }
                    })}
                    className="mt-0.5 rounded text-brass focus:ring-brass"
                  />
                  <div>
                    <span className="font-semibold text-charcoal block">Installation Labour ({formatINR(labourCostINR)})</span>
                    <span className="text-[11px] text-muted">₹35/sq.ft indicative Salem rate</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Total Summary Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border gap-4">
              <div className="text-xs text-muted">
                Prices and tax rates are indicative subject to Salem warehouse physical lot confirmation.
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs text-muted block">Grand Estimated Total</span>
                  <span className="text-2xl font-serif font-bold text-charcoal font-mono">
                    {formatINR(grandTotalINR)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onRequestQuote();
                  }}
                  className="px-5 py-2.5 bg-brass hover:bg-brass-light text-charcoal font-semibold rounded-xl text-xs shadow-md transition-all"
                >
                  Request Store Quote
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Persistent Dock Bar */}
      <div className="bg-charcoal text-ivory border-t border-charcoal-muted px-4 sm:px-6 py-2.5 flex items-center justify-between z-30 select-none shadow-elevated">
        {/* Left Stats */}
        <div className="flex items-center space-x-6 text-xs">
          <div>
            <span className="text-[10px] text-stone-dark uppercase tracking-wider block">Total Area</span>
            <span className="font-semibold text-ivory">
              {totalAreaSqFt} sq.ft <span className="text-stone font-normal text-[10px]">({totalAreaSqM} m²)</span>
            </span>
          </div>

          <div className="hidden sm:block">
            <span className="text-[10px] text-stone-dark uppercase tracking-wider block">Spaces Configured</span>
            <span className="font-semibold text-ivory">
              {configuredSurfacesCount} Surfaces • {selectedProductsCount} Tiles
            </span>
          </div>

          <div className="hidden md:block">
            <span className="text-[10px] text-stone-dark uppercase tracking-wider block">Tile Materials</span>
            <span className="font-semibold text-ivory font-mono">
              {formatINR(materialSubtotalINR)}
            </span>
          </div>

          {accessoriesSubtotalINR > 0 && (
            <div className="hidden lg:block">
              <span className="text-[10px] text-stone-dark uppercase tracking-wider block">Adhesives & Extras</span>
              <span className="font-semibold text-brass font-mono">
                +{formatINR(accessoriesSubtotalINR)}
              </span>
            </div>
          )}
        </div>

        {/* Right CTA and Total */}
        <div className="flex items-center space-x-4">
          {/* Status or Total */}
          {!isComplete ? (
            <div className="text-right hidden sm:block">
              <span className="inline-flex items-center text-xs text-amber-300 font-medium">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> Partial Estimate
              </span>
              <span className="text-[10px] text-stone block">Requires quotation confirmation</span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-[10px] text-stone-dark uppercase tracking-wider block">Estimated Investment</span>
              <span className="text-base sm:text-lg font-serif font-bold text-brass-light font-mono">
                {formatINR(grandTotalINR)}
              </span>
            </div>
          )}

          {/* Expand Details Trigger */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-charcoal-soft hover:bg-charcoal text-xs text-stone hover:text-ivory border border-charcoal-muted/50 transition-colors"
          >
            <span>Breakdown</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* Request Quote Button */}
          <button
            onClick={onRequestQuote}
            className="bg-brass hover:bg-brass-light text-charcoal font-semibold px-4 py-2 rounded-xl text-xs shadow-brass-glow transition-all whitespace-nowrap"
          >
            Request Quotation
          </button>
        </div>
      </div>
    </>
  );
};
