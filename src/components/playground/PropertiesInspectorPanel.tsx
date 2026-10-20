import React, { useState, useMemo } from 'react';
import { useProject } from '../../context/ProjectContext';
import { LayoutPattern } from '../../types';
import { getTileBackgroundStyle } from '../../utils/tileRenderer';
import { formatINR, calculateSurfaceMaterial } from '../../utils/calculator';
import { 
  Search, 
  Check, 
  X, 
  AlertCircle, 
  ArrowUpRight
} from 'lucide-react';

export const PropertiesInspectorPanel: React.FC = () => {
  const {
    activeRoom,
    activeSurface,
    updateSurface,
    assignTileToSurface,
    products,
    productsMap,
  } = useProject();

  const [activeTab, setActiveTab] = useState<'properties' | 'catalogue' | 'pricing'>('properties');
  
  // Catalogue filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!activeRoom || !activeSurface) {
    return (
      <aside className="w-80 bg-white border-l border-border flex items-center justify-center p-6 text-center text-muted">
        Select a surface to inspect properties and choose tiles.
      </aside>
    );
  }

  const assignedProduct = activeSurface.assignedProductId 
    ? productsMap.get(activeSurface.assignedProductId) 
    : undefined;

  const surfaceCalc = calculateSurfaceMaterial(activeSurface, assignedProduct);

  // Filtered catalogue products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesColor = p.color.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesBrand && !matchesColor) return false;
      }
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      return true;
    });
  }, [products, searchQuery, selectedCategory]);

  const groutColors = [
    { label: 'Porcelain White', hex: '#FAF9F6' },
    { label: 'Warm Stone Grey', hex: '#D8D0C3' },
    { label: 'Carbon Black', hex: '#0A0A0A' },
    { label: 'Electric Neon Accent', hex: '#CCFF00' },
  ];

  return (
    <aside className="w-84 bg-white border-l border-border flex flex-col h-full select-none shrink-0 overflow-hidden shadow-subtle font-sans">
      {/* Inspector Tabs Header */}
      <div className="flex items-center border-b border-border bg-[#F8F8FA] p-1.5 space-x-1">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-1.5 text-xs font-bold text-center rounded-full transition-all ${
            activeTab === 'properties' 
              ? 'bg-carbon text-white shadow-sm' 
              : 'text-muted hover:text-carbon'
          }`}
        >
          Properties
        </button>
        <button
          onClick={() => setActiveTab('catalogue')}
          className={`flex-1 py-1.5 text-xs font-bold text-center rounded-full transition-all ${
            activeTab === 'catalogue' 
              ? 'bg-carbon text-white shadow-sm' 
              : 'text-muted hover:text-carbon'
          }`}
        >
          <span>Tiles</span>
          <span className="ml-1.5 px-1.5 py-0.2 text-[9px] bg-neon text-carbon rounded-full font-extrabold">
            {products.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex-1 py-1.5 text-xs font-bold text-center rounded-full transition-all ${
            activeTab === 'pricing' 
              ? 'bg-carbon text-white shadow-sm' 
              : 'text-muted hover:text-carbon'
          }`}
        >
          Pricing
        </button>
      </div>

      {/* Surface Context Banner */}
      <div className="p-3 bg-stone-light/30 border-b border-border flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] uppercase font-mono text-muted tracking-wider block font-bold">
            {activeRoom.name}
          </span>
          <span className="font-extrabold text-carbon truncate block">
            {activeSurface.name}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-muted block uppercase font-mono">Area</span>
          <span className="font-mono font-bold text-carbon">
            {surfaceCalc.requiredAreaSqFt} sq.ft
          </span>
        </div>
      </div>

      {/* Tab 1: Surface Properties */}
      {activeTab === 'properties' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          
          {/* Surface Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-carbon uppercase tracking-wider">
              Surface Label
            </label>
            <input
              type="text"
              value={activeSurface.name}
              onChange={(e) => updateSurface(activeRoom.id, activeSurface.id, { name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-xl bg-white text-carbon font-semibold focus:outline-none focus:ring-2 focus:ring-carbon"
            />
          </div>

          {/* Measured Dimensions */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-carbon uppercase tracking-wider">
              Physical Dimensions (Feet)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-muted block mb-1">
                  {activeSurface.surfaceType === 'wall' || activeSurface.surfaceType === 'feature-wall' ? 'Wall Width (ft)' : 'Length (ft)'}
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={activeSurface.lengthFt}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      updateSurface(activeRoom.id, activeSurface.id, { lengthFt: val });
                    }
                  }}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-white text-carbon font-bold focus:outline-none focus:ring-2 focus:ring-carbon"
                />
              </div>

              <div>
                <span className="text-[10px] text-muted block mb-1">
                  {activeSurface.surfaceType === 'wall' || activeSurface.surfaceType === 'feature-wall' ? 'Wall Height (ft)' : 'Width (ft)'}
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={activeSurface.widthFt}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      updateSurface(activeRoom.id, activeSurface.id, { widthFt: val });
                    }
                  }}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-white text-carbon font-bold focus:outline-none focus:ring-2 focus:ring-carbon"
                />
              </div>
            </div>
          </div>

          {/* Wastage Allowance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-carbon uppercase tracking-wider">
                Cutting Wastage Margin
              </label>
              <span className="font-mono font-extrabold text-carbon bg-neon px-2.5 py-0.5 rounded-full text-[10px]">
                +{activeSurface.wastagePercentage}%
              </span>
            </div>
            <div className="flex space-x-1.5">
              {[5, 8, 10, 12, 15].map((pct) => (
                <button
                  key={pct}
                  onClick={() => updateSurface(activeRoom.id, activeSurface.id, { wastagePercentage: pct })}
                  className={`flex-1 py-1.5 text-xs rounded-full border transition-colors ${
                    activeSurface.wastagePercentage === pct
                      ? 'bg-carbon text-white border-carbon font-bold'
                      : 'bg-white text-muted hover:text-carbon border-border'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Tile Layout Pattern */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-carbon uppercase tracking-wider">
              Installation Pattern
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['grid', 'running-bond', 'diagonal', 'herringbone'] as LayoutPattern[]).map((pat) => (
                <button
                  key={pat}
                  onClick={() => updateSurface(activeRoom.id, activeSurface.id, { layoutPattern: pat })}
                  className={`py-2 px-3 rounded-xl border text-left capitalize transition-all ${
                    activeSurface.layoutPattern === pat
                      ? 'bg-carbon text-white font-bold ring-2 ring-neon border-carbon'
                      : 'bg-white border-border text-muted hover:text-carbon'
                  }`}
                >
                  {pat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Grout Width & Color */}
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-[11px] font-bold text-carbon uppercase tracking-wider">
              Grout Joint & Color
            </label>
            
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-muted">Joint:</span>
              {[2, 3, 5].map((mm) => (
                <button
                  key={mm}
                  onClick={() => updateSurface(activeRoom.id, activeSurface.id, { groutWidthMm: mm })}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    activeSurface.groutWidthMm === mm
                      ? 'bg-carbon text-white border-carbon font-bold'
                      : 'bg-white text-muted border-border'
                  }`}
                >
                  {mm}mm
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              {groutColors.map((gc) => (
                <button
                  key={gc.hex}
                  onClick={() => updateSurface(activeRoom.id, activeSurface.id, { groutColorHex: gc.hex })}
                  className={`w-6 h-6 rounded-full border shadow-sm transition-transform ${
                    activeSurface.groutColorHex === gc.hex ? 'scale-125 ring-2 ring-carbon' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: gc.hex }}
                  title={gc.label}
                />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Embedded Tile Catalogue */}
      {activeTab === 'catalogue' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model, finish..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-full bg-white text-carbon focus:outline-none focus:ring-2 focus:ring-carbon"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-1 text-[10px]">
            {['all', 'floor', 'wall', 'elevation', 'outdoor', 'mosaic'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full capitalize transition-colors font-semibold ${
                  selectedCategory === cat 
                    ? 'bg-carbon text-white' 
                    : 'bg-stone-light/50 text-muted hover:text-carbon'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Product Swatch Card if selected */}
          {assignedProduct && (
            <div className="p-3 bg-neon/15 border border-neon rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div 
                  className="w-10 h-10 rounded-xl border border-carbon shrink-0 shadow-sm"
                  style={getTileBackgroundStyle(assignedProduct, 'grid', 2, '#D8D0C3', 0)}
                />
                <div className="truncate">
                  <span className="text-[10px] text-carbon font-extrabold uppercase tracking-wider block">
                    Applied Tile
                  </span>
                  <span className="text-xs font-bold text-carbon truncate block">
                    {assignedProduct.name}
                  </span>
                  <span className="text-[10px] text-muted">
                    {assignedProduct.priceBasis === 'quote' ? 'Price on Request' : `${formatINR(assignedProduct.pricePerUnit || 0)}/${assignedProduct.priceBasis}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => assignTileToSurface(activeRoom.id, activeSurface.id, '')}
                className="p-1 text-muted hover:text-red-600 rounded-full"
                title="Remove tile assignment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Product Cards List */}
          <div className="space-y-2 flex-1">
            {filteredProducts.map((prod) => {
              const isAssigned = activeSurface.assignedProductId === prod.id;
              const swatch = getTileBackgroundStyle(prod, 'grid', 2, '#D8D0C3', 0);

              return (
                <div
                  key={prod.id}
                  onClick={() => assignTileToSurface(activeRoom.id, activeSurface.id, prod.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    isAssigned
                      ? 'border-carbon bg-[#F6F6F8] shadow-sm ring-2 ring-neon'
                      : 'border-border/80 bg-white hover:border-carbon'
                  }`}
                >
                  {/* Swatch */}
                  <div 
                    className="w-12 h-12 rounded-xl border border-border shrink-0 shadow-inner relative overflow-hidden"
                    style={{
                      ...swatch,
                      backgroundSize: '24px 24px',
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-muted uppercase font-bold">
                        {prod.sku}
                      </span>
                      {prod.priceBasis === 'quote' ? (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full font-bold">
                          Quote Req.
                        </span>
                      ) : (
                        <span className="text-xs font-extrabold text-carbon">
                          {formatINR(prod.pricePerUnit || 0)} <span className="text-[10px] text-muted font-normal">/{prod.priceBasis}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-carbon truncate mt-0.5">
                      {prod.name}
                    </h4>

                    <div className="text-[10px] text-muted flex items-center space-x-2 mt-0.5">
                      <span>{prod.dimensions.widthMm} × {prod.dimensions.heightMm} mm</span>
                      <span>•</span>
                      <span className="capitalize">{prod.finish}</span>
                    </div>
                  </div>

                  {isAssigned && (
                    <div className="w-5 h-5 rounded-full bg-neon text-carbon flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Pricing & Quantity Breakdown */}
      {activeTab === 'pricing' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          <div className="p-4 bg-white rounded-2xl border border-border shadow-subtle space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
              Surface Area Calculations
            </span>

            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted">Gross Area ({activeSurface.lengthFt} × {activeSurface.widthFt} ft)</span>
              <span className="font-mono text-carbon font-bold">{surfaceCalc.grossAreaSqFt} sq.ft</span>
            </div>

            {surfaceCalc.deductionAreaSqFt > 0 && (
              <div className="flex justify-between py-1 border-b border-border/40 text-red-600 font-bold">
                <span>Openings Deductions</span>
                <span className="font-mono">-{surfaceCalc.deductionAreaSqFt} sq.ft</span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-border/40 font-extrabold text-carbon">
              <span>Net Surface Area</span>
              <span className="font-mono">{surfaceCalc.netAreaSqFt} sq.ft</span>
            </div>

            <div className="flex justify-between py-1 border-b border-border/40 text-muted">
              <span>Wastage Allowance (+{activeSurface.wastagePercentage}%)</span>
              <span className="font-mono font-bold">
                +{(surfaceCalc.requiredAreaSqFt - surfaceCalc.netAreaSqFt).toFixed(2)} sq.ft
              </span>
            </div>

            <div className="flex justify-between pt-1 font-extrabold text-carbon">
              <span>Procurement Area</span>
              <span className="font-mono text-carbon">
                {surfaceCalc.requiredAreaSqFt} sq.ft ({surfaceCalc.requiredAreaSqM} m²)
              </span>
            </div>
          </div>

          {/* Packaging & Pricing */}
          <div className="p-4 bg-white rounded-2xl border border-border shadow-subtle space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
              Tile Procurement & Packs
            </span>

            {assignedProduct ? (
              <>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted">Price Basis</span>
                  <span className="font-mono uppercase font-bold text-carbon">{assignedProduct.priceBasis}</span>
                </div>

                {assignedProduct.priceBasis === 'quote' ? (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>This tile requires showroom batch confirmation. Final price will be confirmed in your quote enquiry.</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted">Unit Rate</span>
                      <span className="font-mono font-bold text-carbon">
                        {formatINR(assignedProduct.pricePerUnit || 0)} / {assignedProduct.priceBasis}
                      </span>
                    </div>

                    {surfaceCalc.packsRequired && (
                      <div className="flex justify-between py-1 border-b border-border/40">
                        <span className="text-muted">Boxes Required</span>
                        <span className="font-mono font-bold text-carbon">
                          {surfaceCalc.packsRequired} boxes ({assignedProduct.packCoverageSqFt || 15.5} sq.ft/box)
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between pt-2 text-sm font-extrabold text-carbon">
                      <span>Material Cost</span>
                      <span className="font-mono text-carbon">
                        {formatINR(surfaceCalc.materialCostINR)}
                      </span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-muted py-2 text-center">Assign a tile in the catalogue tab to view costs.</p>
            )}
          </div>

        </div>
      )}
    </aside>
  );
};
