import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { formatINR } from '../../utils/calculator';
import { Printer, Download, X, Building, ShieldCheck } from 'lucide-react';

interface PdfQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfQuotationModal: React.FC<PdfQuotationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    project, 
    calculationResult, 
    businessSettings 
  } = useProject();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const validUntilDate = new Date(Date.now() + (businessSettings.quoteExpiryDays || 14) * 86400000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-modal border border-border my-8 relative text-charcoal">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="no-print flex items-center justify-between pb-6 mb-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-charcoal text-ivory rounded-md">
              Official Quotation PDF Sheet
            </span>
            <span className="text-xs text-muted">Ready for client print or PDF archiving</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 bg-charcoal text-ivory hover:bg-charcoal-soft rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted hover:text-charcoal rounded-xl hover:bg-stone-light/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Letterhead Document */}
        <div className="printable-quotation-sheet space-y-6">
          
          {/* Top Brand Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-charcoal gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-lg bg-brass flex items-center justify-center font-serif font-bold text-charcoal text-lg shadow-sm">
                  KT
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold tracking-tight text-charcoal uppercase">
                    {businessSettings.businessName}
                  </h2>
                  <p className="text-[11px] text-brass-dark font-medium italic">
                    {businessSettings.tagline}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted mt-2 max-w-sm leading-relaxed">
                {businessSettings.address}
              </p>
              <div className="text-[11px] text-muted space-x-3 mt-1">
                <span>Phone: {businessSettings.phone}</span>
                <span>•</span>
                <span>GSTIN: {businessSettings.gstin}</span>
              </div>
            </div>

            <div className="text-right sm:self-start">
              <span className="text-xs font-bold uppercase tracking-widest text-muted block">
                PROJECT ESTIMATION & QUOTE
              </span>
              <span className="text-sm font-mono font-bold text-charcoal block mt-1">
                REF: KT-{(project.id || 'PLAN').toUpperCase()}
              </span>
              <div className="text-xs text-muted mt-1 space-y-0.5">
                <div>Date: <strong className="text-charcoal">{currentDate}</strong></div>
                <div>Valid Until: <strong className="text-charcoal">{validUntilDate}</strong></div>
              </div>
            </div>
          </div>

          {/* Client & Project Details Bar */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-ivory text-xs">
            <div>
              <span className="text-[10px] text-muted uppercase tracking-wider font-semibold block mb-0.5">
                Client Information
              </span>
              <span className="font-bold text-charcoal text-sm block">
                {project.customerName || 'Valued Architectural Client'}
              </span>
              <span className="text-muted block">
                Contact: {project.customerPhone || 'Upon request'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-muted uppercase tracking-wider font-semibold block mb-0.5">
                Project Scope
              </span>
              <span className="font-bold text-charcoal text-sm block">
                {project.title}
              </span>
              <span className="text-muted block">
                Total Covered Area: {calculationResult.totalAreaSqFt} sq.ft ({calculationResult.totalAreaSqM} m²)
              </span>
            </div>
          </div>

          {/* Itemized Room & Surface Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Detailed Bill of Quantities (BOQ)
            </h4>

            <table className="w-full text-xs text-left border border-border rounded-lg overflow-hidden">
              <thead className="bg-porcelain border-b border-border text-muted uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-2.5">Room & Surface</th>
                  <th className="p-2.5">Specified Tile Product</th>
                  <th className="p-2.5 text-center">Net Area</th>
                  <th className="p-2.5 text-center">Wastage</th>
                  <th className="p-2.5 text-right">Required (Bxs)</th>
                  <th className="p-2.5 text-right">Unit Rate</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {calculationResult.roomCalculations.map((room) => (
                  <React.Fragment key={room.roomId}>
                    <tr className="bg-ivory/50 font-bold text-charcoal">
                      <td colSpan={6} className="p-2 px-3">
                        {room.roomName}
                      </td>
                      <td className="p-2 px-3 text-right font-mono">
                        {formatINR(room.totalMaterialCostINR)}
                      </td>
                    </tr>
                    {room.surfacesCalculations.map((s) => (
                      <tr key={s.surfaceId} className="hover:bg-porcelain/40">
                        <td className="p-2 px-3 pl-6 font-medium text-charcoal">
                          {s.surfaceName}
                        </td>
                        <td className="p-2 px-3 text-muted">
                          {s.assignedProduct ? (
                            <span>{s.assignedProduct.name} <span className="font-mono text-[10px]">({s.assignedProduct.sku})</span></span>
                          ) : (
                            <span className="text-amber-700 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="p-2 px-3 text-center font-mono">
                          {s.netAreaSqFt}
                        </td>
                        <td className="p-2 px-3 text-center font-mono text-muted">
                          +{s.wastagePercentage}%
                        </td>
                        <td className="p-2 px-3 text-right font-mono text-charcoal">
                          {s.requiredAreaSqFt} sq.ft {s.packsRequired && `(${s.packsRequired} bxs)`}
                        </td>
                        <td className="p-2 px-3 text-right font-mono text-muted">
                          {s.isQuoteRequired ? 'Enquiry' : formatINR(s.unitPrice || 0) + '/' + (s.priceBasis || 'sqft')}
                        </td>
                        <td className="p-2 px-3 text-right font-mono font-semibold text-charcoal">
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

          {/* Accessories & Totals Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
            {/* Terms and Notes */}
            <div className="text-[11px] text-muted space-y-1.5 leading-relaxed">
              <span className="font-bold text-charcoal uppercase tracking-wider block text-[10px]">
                Standard Terms & Conditions
              </span>
              <p>• All tile quantities include recommended cutting wastage. Unused full unbroken boxes in original packing may be returned within 7 days.</p>
              <p>• Natural shade and tonal variation is intrinsic to vitrified and natural stone tiles. Please inspect tiles before laying.</p>
              <p>• Delivery charges to Salem / Kandanoor sites will be calculated on actual vehicle dispatch.</p>
            </div>

            {/* Price Rollup */}
            <div className="bg-porcelain p-4 rounded-xl border border-border text-xs space-y-2">
              <div className="flex justify-between text-muted">
                <span>Tile Materials Subtotal</span>
                <span className="font-mono text-charcoal font-semibold">
                  {formatINR(calculationResult.materialSubtotalINR)}
                </span>
              </div>

              {calculationResult.adhesiveCostINR > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Tile Adhesive (Spec. Bags)</span>
                  <span className="font-mono text-charcoal">
                    {formatINR(calculationResult.adhesiveCostINR)}
                  </span>
                </div>
              )}

              {calculationResult.groutCostINR > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Polymer Grout (Spec. Packets)</span>
                  <span className="font-mono text-charcoal">
                    {formatINR(calculationResult.groutCostINR)}
                  </span>
                </div>
              )}

              {calculationResult.labourCostINR > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Indicative Installation Labour</span>
                  <span className="font-mono text-charcoal">
                    {formatINR(calculationResult.labourCostINR)}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-border text-sm font-bold text-charcoal">
                <span>Total Indicative Estimate</span>
                <span className="font-serif font-bold text-base font-mono text-charcoal">
                  {formatINR(calculationResult.grandTotalINR)}
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Seal Footer */}
          <div className="pt-8 border-t border-border/80 flex justify-between items-end text-xs text-muted">
            <div>
              <span>Generated on Krishna Tiles Live Playground</span>
              <div className="text-[10px] mt-0.5">Subject to Salem warehouse confirmation</div>
            </div>

            <div className="text-right">
              <div className="w-40 border-b border-charcoal/40 mb-1" />
              <span className="text-[10px] font-medium text-charcoal uppercase tracking-wider">
                For Krishna Tiles & Granites
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
