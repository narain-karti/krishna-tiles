import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { getTileBackgroundStyle } from '../../utils/tileRenderer';
import { formatINR, calculateRequiredArea } from '../../utils/calculator';
import { Layers, Plus, Trash2, Sliders } from 'lucide-react';

export const WallElevationCanvas: React.FC = () => {
  const {
    activeRoom,
    activeSurface,
    updateSurface,
    productsMap,
    setActiveSurfaceId,
  } = useProject();

  if (!activeRoom || !activeSurface) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        Select a room and wall surface to view elevation.
      </div>
    );
  }

  // Find wall surfaces in active room
  const wallSurfaces = activeRoom.surfaces.filter(s => 
    s.surfaceType === 'wall' || s.surfaceType === 'feature-wall' || s.surfaceType === 'backsplash'
  );

  const surfaceProduct = activeSurface.assignedProductId 
    ? productsMap.get(activeSurface.assignedProductId) 
    : undefined;

  const wallStyle = getTileBackgroundStyle(
    surfaceProduct,
    activeSurface.layoutPattern,
    activeSurface.groutWidthMm,
    activeSurface.groutColorHex,
    activeSurface.orientationDeg
  );

  const grossArea = activeSurface.lengthFt * activeSurface.widthFt;
  const openingsArea = (activeSurface.openings || []).reduce((acc, o) => acc + (o.widthFt * o.heightFt), 0);
  const netArea = Math.max(0, grossArea - openingsArea);

  return (
    <div className="relative flex flex-col h-full w-full bg-[#EDE8DF] select-none overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md border-b border-border/80 z-10">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-charcoal text-ivory rounded-md">
            Wall Elevation View
          </span>
          <span className="text-sm font-serif font-medium text-charcoal">
            {activeRoom.name} — {activeSurface.name}
          </span>
          <span className="text-xs text-muted">
            (Span: {activeSurface.lengthFt} ft • Height: {activeSurface.widthFt} ft)
          </span>
        </div>

        {/* Wall Surface Switcher */}
        <div className="flex items-center space-x-2">
          {wallSurfaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => setActiveSurfaceId(ws.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSurface.id === ws.id
                  ? 'bg-charcoal text-white shadow-sm'
                  : 'bg-white/80 text-muted hover:text-charcoal border border-border'
              }`}
            >
              {ws.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Elevation Canvas */}
      <div className="relative flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="relative w-full max-w-4xl h-[420px] bg-white rounded-2xl shadow-elevated border-2 border-charcoal/20 p-8 flex flex-col items-center justify-center">
          
          {/* Elevation Dimensions */}
          <div className="absolute -top-7 inset-x-8 flex items-center justify-center">
            <div className="text-xs font-mono font-medium text-charcoal/80 bg-white/90 px-3 py-0.5 rounded border border-border shadow-sm">
              Wall Width: {activeSurface.lengthFt} ft
            </div>
          </div>

          <div className="absolute -left-12 inset-y-8 flex items-center justify-center">
            <div className="rotate-[-90deg] text-xs font-mono font-medium text-charcoal/80 bg-white/90 px-3 py-0.5 rounded border border-border shadow-sm">
              Ceiling Height: {activeSurface.widthFt} ft
            </div>
          </div>

          {/* Wall Panel */}
          <div 
            className="relative w-full h-full rounded-xl overflow-hidden shadow-inner border border-border flex flex-col justify-between"
            style={{
              ...wallStyle,
              backgroundSize: '100px 50px',
            }}
          >
            {/* Top Shadow / Ceiling Line */}
            <div className="w-full h-3 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

            {/* Simulated Openings (Doors / Windows) */}
            <div className="absolute inset-0 flex items-end justify-around px-12 pointer-events-none">
              {(activeSurface.openings || []).map((opening, idx) => (
                <div 
                  key={opening.id || idx}
                  className="w-32 h-48 bg-stone-light/90 border-2 border-dashed border-charcoal/40 rounded-t flex flex-col items-center justify-center p-2 text-center shadow-md backdrop-blur-sm"
                >
                  <span className="text-xs font-semibold text-charcoal">{opening.name}</span>
                  <span className="text-[10px] text-muted">{opening.widthFt} × {opening.heightFt} ft</span>
                  <span className="text-[10px] text-red-600 font-medium">(-{opening.widthFt * opening.heightFt} sq.ft)</span>
                </div>
              ))}

              {(!activeSurface.openings || activeSurface.openings.length === 0) && (
                <div className="w-28 h-56 bg-white/80 border-2 border-charcoal/30 rounded-t flex flex-col items-center justify-center p-2 text-center shadow-sm backdrop-blur-[1px]">
                  <div className="w-3 h-3 rounded-full bg-brass/60 mb-2" />
                  <span className="text-[11px] font-medium text-charcoal">Entryway Door</span>
                  <span className="text-[9px] text-muted">Architectural Scale</span>
                </div>
              )}
            </div>

            {/* Skirting Board at base */}
            <div className="w-full h-5 bg-charcoal/90 border-t border-brass/40 flex items-center px-4 z-10">
              <span className="text-[9px] text-ivory/80 uppercase tracking-widest font-mono">Skirting Strip (4-inch)</span>
            </div>
          </div>
        </div>

        {/* Floating Quick Action: Add Window / Door Opening Deduction */}
        <div className="absolute bottom-6 right-8 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-border shadow-elevated flex items-center space-x-3 text-xs z-20">
          <span className="text-muted">Net Area: <strong className="text-charcoal">{netArea} sq.ft</strong></span>
          <button
            onClick={() => {
              const currentOpenings = activeSurface.openings || [];
              const newOpening = {
                id: 'op-' + Date.now(),
                name: 'Window Opening',
                widthFt: 4,
                heightFt: 4,
              };
              updateSurface(activeRoom.id, activeSurface.id, {
                openings: [...currentOpenings, newOpening],
              });
            }}
            className="flex items-center space-x-1 px-3 py-1.5 bg-ivory hover:bg-stone-light text-charcoal font-medium rounded-lg border border-border transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Window Cutout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
