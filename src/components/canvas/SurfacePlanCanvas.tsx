import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { getTileBackgroundStyle } from '../../utils/tileRenderer';
import { formatINR, calculateRequiredArea } from '../../utils/calculator';
import { Columns, Rows, Plus, Trash2, Edit3, Grid, Layers, Sparkles } from 'lucide-react';

export const SurfacePlanCanvas: React.FC = () => {
  const {
    activeRoom,
    activeSurface,
    updateSurface,
    splitSurfaceZone,
    deleteSurfaceZone,
    addSurfaceZone,
    productsMap,
    products,
  } = useProject();

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('Decorative Center Rug');

  if (!activeRoom || !activeSurface) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        Select a room and surface to view top-down plan.
      </div>
    );
  }

  const surfaceProduct = activeSurface.assignedProductId 
    ? productsMap.get(activeSurface.assignedProductId) 
    : undefined;

  const grossAreaSqFt = activeSurface.lengthFt * activeSurface.widthFt;
  const netAreaSqFt = Math.max(0, grossAreaSqFt - (activeSurface.openings || []).reduce((a, o) => a + (o.widthFt * o.heightFt), 0));
  const { requiredAreaSqFt } = calculateRequiredArea(netAreaSqFt, activeSurface.wastagePercentage);

  const mainSurfaceStyle = getTileBackgroundStyle(
    surfaceProduct,
    activeSurface.layoutPattern,
    activeSurface.groutWidthMm,
    activeSurface.groutColorHex,
    activeSurface.orientationDeg
  );

  const zones = activeSurface.zones || [];

  return (
    <div className="relative flex flex-col h-full w-full bg-[#EDE8DF] select-none overflow-hidden">
      {/* Plan Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md border-b border-border/80 z-10 gap-3">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-charcoal text-ivory rounded-md">
            Surface CAD Plan
          </span>
          <span className="text-sm font-serif font-medium text-charcoal">
            {activeRoom.name} — {activeSurface.name}
          </span>
          <span className="text-xs text-muted">
            ({activeSurface.lengthFt} ft × {activeSurface.widthFt} ft = {netAreaSqFt} sq.ft)
          </span>
        </div>

        {/* Zone Partition Tools */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => splitSurfaceZone(activeRoom.id, activeSurface.id, 'vertical', 50)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-charcoal bg-stone-light hover:bg-stone rounded-lg transition-colors border border-border"
            title="Split surface into left and right zones"
          >
            <Columns className="w-3.5 h-3.5 text-charcoal" />
            <span>Split Vertical</span>
          </button>

          <button
            onClick={() => splitSurfaceZone(activeRoom.id, activeSurface.id, 'horizontal', 50)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-charcoal bg-stone-light hover:bg-stone rounded-lg transition-colors border border-border"
            title="Split surface into top and bottom zones"
          >
            <Rows className="w-3.5 h-3.5 text-charcoal" />
            <span>Split Horizontal</span>
          </button>

          <button
            onClick={() => {
              addSurfaceZone(activeRoom.id, activeSurface.id, {
                name: 'Center Feature Inlay',
                xPct: 20,
                yPct: 20,
                widthPct: 60,
                heightPct: 60,
                assignedProductId: 'prod-chettinad-accent',
              });
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brass hover:bg-brass-dark rounded-lg transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add Center Inlay</span>
          </button>

          {zones.length > 0 && (
            <button
              onClick={() => updateSurface(activeRoom.id, activeSurface.id, { zones: [] })}
              className="p-1.5 text-muted hover:text-red-600 rounded-lg transition-colors"
              title="Clear all zones"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Top-Down Canvas */}
      <div className="relative flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="relative w-full max-w-3xl aspect-[4/3] bg-white rounded-2xl shadow-elevated border-2 border-charcoal/20 p-8 flex flex-col items-center justify-center">
          
          {/* Dimension Label Top */}
          <div className="absolute -top-7 inset-x-8 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-xs font-mono font-medium text-charcoal/80 bg-white/90 px-3 py-0.5 rounded border border-border shadow-sm">
              <span className="w-4 h-[1px] bg-charcoal/40" />
              <span>Width: {activeSurface.lengthFt} ft</span>
              <span className="w-4 h-[1px] bg-charcoal/40" />
            </div>
          </div>

          {/* Dimension Label Left */}
          <div className="absolute -left-12 inset-y-8 flex items-center justify-center">
            <div className="rotate-[-90deg] flex items-center space-x-2 text-xs font-mono font-medium text-charcoal/80 bg-white/90 px-3 py-0.5 rounded border border-border shadow-sm">
              <span className="w-4 h-[1px] bg-charcoal/40" />
              <span>Depth: {activeSurface.widthFt} ft</span>
              <span className="w-4 h-[1px] bg-charcoal/40" />
            </div>
          </div>

          {/* The Surface Container */}
          <div 
            className="relative w-full h-full rounded-xl overflow-hidden shadow-inner border border-border cursor-crosshair"
            style={{
              ...mainSurfaceStyle,
              backgroundSize: '80px 80px',
            }}
            onClick={() => setSelectedZoneId(null)}
          >
            {/* Architectural Grid Lines Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#29251F_0.8px,transparent_0.8px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

            {/* Surface Info Watermark */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/80 text-xs shadow-sm">
              <div className="font-semibold text-charcoal">{activeSurface.name} (Base Layer)</div>
              <div className="text-muted text-[11px]">
                {surfaceProduct?.name || 'Unassigned Tile'} • {surfaceProduct ? (surfaceProduct.priceBasis === 'quote' ? 'Price on Request' : formatINR(surfaceProduct.pricePerUnit || 0) + '/' + surfaceProduct.priceBasis) : 'Select Tile'}
              </div>
            </div>

            {/* Render Configured Zones */}
            {zones.map((zone) => {
              const zoneProduct = zone.assignedProductId 
                ? productsMap.get(zone.assignedProductId) 
                : surfaceProduct;

              const isSelected = selectedZoneId === zone.id;
              const zoneAreaSqFt = Number(((zone.widthPct / 100) * (zone.heightPct / 100) * netAreaSqFt).toFixed(1));

              const zoneStyle = getTileBackgroundStyle(
                zoneProduct,
                'grid',
                2,
                '#D8D0C3',
                0
              );

              return (
                <div
                  key={zone.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedZoneId(zone.id);
                  }}
                  className={`absolute rounded-md cursor-pointer transition-all duration-200 overflow-hidden shadow-md ${
                    isSelected ? 'ring-4 ring-brass shadow-elevated z-20' : 'hover:ring-2 hover:ring-brass/60 z-10'
                  }`}
                  style={{
                    left: `${zone.xPct}%`,
                    top: `${zone.yPct}%`,
                    width: `${zone.widthPct}%`,
                    height: `${zone.heightPct}%`,
                    ...zoneStyle,
                    backgroundSize: '50px 50px',
                  }}
                >
                  {/* Subtle Zone Label and Price Tag */}
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-between bg-charcoal/90 text-ivory px-2.5 py-1 rounded text-[11px] backdrop-blur-sm">
                    <span className="font-medium truncate mr-2">{zone.name}</span>
                    <span className="font-mono text-brass-light shrink-0">{zoneAreaSqFt} sq.ft</span>
                  </div>

                  {/* Tile Swatch Pill */}
                  {zoneProduct && (
                    <div className="absolute top-2 left-2 bg-white/95 text-charcoal px-2 py-0.5 rounded text-[10px] font-medium shadow-sm">
                      {zoneProduct.name}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Cutouts & Openings (e.g. Doors, Windows) */}
            {(activeSurface.openings || []).map((opening) => (
              <div 
                key={opening.id}
                className="absolute top-0 right-10 w-24 h-6 bg-red-100/90 border border-dashed border-red-500 rounded-b text-[10px] text-red-800 font-medium flex items-center justify-center shadow-sm"
              >
                {opening.name} (-{opening.widthFt * opening.heightFt} sq.ft)
              </div>
            ))}
          </div>
        </div>

        {/* Selected Zone Inspector Float */}
        {selectedZoneId && (() => {
          const zone = zones.find(z => z.id === selectedZoneId);
          if (!zone) return null;
          const zoneProduct = zone.assignedProductId ? productsMap.get(zone.assignedProductId) : undefined;
          const zoneAreaSqFt = Number(((zone.widthPct / 100) * (zone.heightPct / 100) * netAreaSqFt).toFixed(1));

          return (
            <div className="absolute bottom-6 inset-x-8 max-w-xl mx-auto bg-white/95 backdrop-blur-md p-4 rounded-xl border border-brass/50 shadow-elevated flex items-center justify-between gap-4 z-30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brass">Selected Zone</span>
                  <span className="text-sm font-semibold text-charcoal truncate">{zone.name}</span>
                </div>
                <div className="text-xs text-muted mt-0.5">
                  Dimensions: {zone.widthPct}% × {zone.heightPct}% ({zoneAreaSqFt} sq.ft) • {zoneProduct?.name || 'Using surface base tile'}
                </div>
              </div>

              {/* Assign different tile dropdown */}
              <div className="flex items-center space-x-2 shrink-0">
                <select
                  value={zone.assignedProductId || ''}
                  onChange={(e) => {
                    const prodId = e.target.value;
                    const updatedZones = zones.map(z => z.id === zone.id ? { ...z, assignedProductId: prodId } : z);
                    updateSurface(activeRoom.id, activeSurface.id, { zones: updatedZones });
                  }}
                  className="text-xs bg-ivory border border-border rounded-lg px-2.5 py-1.5 text-charcoal focus:outline-none focus:ring-1 focus:ring-brass"
                >
                  <option value="">(Inherit Base Tile)</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>

                <button
                  onClick={() => deleteSurfaceZone(activeRoom.id, activeSurface.id, zone.id)}
                  className="p-1.5 text-muted hover:text-red-600 rounded-lg hover:bg-stone-light transition-colors"
                  title="Remove this zone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
