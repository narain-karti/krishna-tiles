import React, { useMemo } from 'react';
import { useProject } from '../../context/ProjectContext';
import { getTileBackgroundStyle } from '../../utils/tileRenderer';
import { formatINR } from '../../utils/calculator';
import { Maximize2, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export const RoomPreviewCanvas: React.FC = () => {
  const { 
    activeRoom, 
    activeSurface, 
    setActiveSurfaceId, 
    productsMap,
    calculationResult 
  } = useProject();

  if (!activeRoom) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        Select or add a room to begin visual preview.
      </div>
    );
  }

  // Find surfaces by type in this room
  const floorSurface = activeRoom.surfaces.find(s => s.surfaceType === 'floor') || activeRoom.surfaces[0];
  const wallSurface = activeRoom.surfaces.find(s => s.surfaceType === 'wall' || s.surfaceType === 'feature-wall');
  const backsplashSurface = activeRoom.surfaces.find(s => s.surfaceType === 'backsplash');

  const floorProduct = floorSurface?.assignedProductId ? productsMap.get(floorSurface.assignedProductId) : undefined;
  const wallProduct = wallSurface?.assignedProductId ? productsMap.get(wallSurface.assignedProductId) : undefined;
  const backsplashProduct = backsplashSurface?.assignedProductId ? productsMap.get(backsplashSurface.assignedProductId) : undefined;

  // Floor style
  const floorStyle = useMemo(() => {
    return getTileBackgroundStyle(
      floorProduct,
      floorSurface?.layoutPattern || 'grid',
      floorSurface?.groutWidthMm || 2,
      floorSurface?.groutColorHex || '#D8D0C3',
      floorSurface?.orientationDeg || 0
    );
  }, [floorProduct, floorSurface]);

  // Wall style
  const wallStyle = useMemo(() => {
    return getTileBackgroundStyle(
      wallProduct,
      wallSurface?.layoutPattern || 'grid',
      wallSurface?.groutWidthMm || 2,
      wallSurface?.groutColorHex || '#D8D0C3',
      wallSurface?.orientationDeg || 0
    );
  }, [wallProduct, wallSurface]);

  // Backsplash style
  const backsplashStyle = useMemo(() => {
    return getTileBackgroundStyle(
      backsplashProduct,
      backsplashSurface?.layoutPattern || 'running-bond',
      backsplashSurface?.groutWidthMm || 2,
      backsplashSurface?.groutColorHex || '#FAF9F6',
      0
    );
  }, [backsplashProduct, backsplashSurface]);

  const isFloorActive = activeSurface?.id === floorSurface?.id;
  const isWallActive = activeSurface?.id === wallSurface?.id;
  const isBacksplashActive = activeSurface?.id === backsplashSurface?.id;

  // Calculation for active surface
  const activeSurfaceCalc = calculationResult.roomCalculations
    .find(r => r.roomId === activeRoom.id)
    ?.surfacesCalculations.find(s => s.surfaceId === activeSurface?.id);

  return (
    <div className="relative flex flex-col h-full w-full bg-[#EDE8DF] select-none overflow-hidden">
      {/* Top Scene Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-md border-b border-border/80 z-10">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-charcoal text-ivory rounded-md">
            Room 2.5D Visualizer
          </span>
          <span className="text-sm font-serif font-medium text-charcoal">
            {activeRoom.name}
          </span>
          <span className="text-xs text-muted">
            ({activeRoom.lengthFt} × {activeRoom.widthFt} ft • Height: {activeRoom.heightFt} ft)
          </span>
        </div>

        {/* Selected Surface Pill */}
        {activeSurface && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted">Focused:</span>
            <span className="font-medium text-charcoal bg-brass/20 px-2 py-0.5 rounded text-charcoal">
              {activeSurface.name}
            </span>
            {activeSurfaceCalc?.isQuoteRequired ? (
              <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <AlertCircle className="w-3 h-3 mr-1" /> Price on request
              </span>
            ) : activeSurfaceCalc?.unitPrice ? (
              <span className="text-charcoal font-semibold">
                {formatINR(activeSurfaceCalc.materialCostINR)}
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Main 2.5D Isometric/Perspective Stage */}
      <div className="relative flex-1 flex items-center justify-center p-8 overflow-hidden">
        {/* Architectural Room Box */}
        <div className="relative w-full max-w-4xl h-[480px] bg-white rounded-2xl shadow-elevated border border-border/90 overflow-hidden flex flex-col">
          
          {/* Upper Half: Wall & Elevation Planes */}
          <div className="relative h-[56%] w-full flex border-b border-border">
            
            {/* Left/Back Feature Wall */}
            <div 
              onClick={() => wallSurface && setActiveSurfaceId(wallSurface.id)}
              className={`relative flex-1 cursor-pointer transition-all duration-300 overflow-hidden ${
                isWallActive ? 'ring-2 ring-brass shadow-inner' : 'hover:brightness-95'
              }`}
              style={{
                ...wallStyle,
                backgroundSize: '120px 80px',
              }}
              title="Click to customize Wall Tile"
            >
              {/* Wall Light Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/10 pointer-events-none" />

              {/* Surface Label Badge */}
              <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-charcoal shadow-sm">
                <Layers className="w-3.5 h-3.5 text-brass" />
                <span>{wallSurface?.name || 'Main Wall'}</span>
                {wallProduct && <span className="text-muted font-normal">({wallProduct.name})</span>}
              </div>

              {/* Architectural Window / Art Silhouette for scale */}
              <div className="absolute right-8 top-6 w-24 h-32 rounded border-2 border-charcoal/20 bg-sky-100/30 backdrop-blur-[1px] flex flex-col justify-between p-1.5 shadow-sm">
                <div className="w-full h-1/2 border-b border-charcoal/20" />
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-charcoal/20" />
              </div>

              {/* Backsplash Section if Kitchen */}
              {activeRoom.roomType === 'kitchen' && backsplashSurface && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSurfaceId(backsplashSurface.id);
                  }}
                  className={`absolute bottom-0 inset-x-0 h-20 border-t-2 border-charcoal/20 transition-all ${
                    isBacksplashActive ? 'ring-2 ring-brass z-10' : 'hover:brightness-95'
                  }`}
                  style={{
                    ...backsplashStyle,
                    backgroundSize: '40px 20px',
                  }}
                >
                  <div className="absolute top-1 left-3 bg-charcoal/90 text-ivory text-[10px] px-2 py-0.5 rounded font-medium">
                    {backsplashSurface.name} {backsplashProduct && `• ${backsplashProduct.name}`}
                  </div>
                </div>
              )}
            </div>

            {/* Right Return Wall (Perspective Shading) */}
            <div className="w-44 bg-[#DCD4C6] border-l border-border relative overflow-hidden hidden sm:block">
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-black/5" />
              <div className="absolute bottom-6 right-4 text-right">
                <span className="text-[11px] font-mono text-charcoal/60 uppercase tracking-wider block">Wall Depth</span>
                <span className="text-xs font-semibold text-charcoal">{activeRoom.widthFt} ft</span>
              </div>
            </div>
          </div>

          {/* Lower Half: Floor Plane with 2.5D Perspective Projection */}
          <div 
            onClick={() => floorSurface && setActiveSurfaceId(floorSurface.id)}
            className={`relative flex-1 cursor-pointer transition-all duration-300 overflow-hidden ${
              isFloorActive ? 'ring-2 ring-brass shadow-inner' : 'hover:brightness-95'
            }`}
            style={{
              perspective: '600px',
            }}
            title="Click to customize Floor Tile"
          >
            {/* The 2.5D tilted floor surface */}
            <div 
              className="absolute inset-0 origin-top transform transition-transform"
              style={{
                ...floorStyle,
                backgroundSize: '140px 140px',
                transform: 'rotateX(25deg) scaleY(1.3) scaleX(1.08)',
              }}
            >
              {/* Floor Shadow & Ambient Light Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-white/10 pointer-events-none" />

              {/* Decorative Inlay / Zone Highlight if any */}
              {floorSurface?.zones && floorSurface.zones.length > 0 && (
                <div 
                  className="absolute inset-x-[20%] inset-y-[20%] border-2 border-dashed border-brass/80 rounded bg-brass/10 pointer-events-none flex items-center justify-center"
                >
                  <span className="text-[11px] font-semibold bg-white/95 px-2 py-0.5 rounded text-charcoal shadow-sm">
                    {floorSurface.zones[0].name}
                  </span>
                </div>
              )}
            </div>

            {/* Surface Label Badge */}
            <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-charcoal shadow-sm z-10">
              <Layers className="w-3.5 h-3.5 text-brass" />
              <span>{floorSurface?.name || 'Main Floor'}</span>
              {floorProduct && <span className="text-muted font-normal">({floorProduct.name})</span>}
            </div>

            {/* Furniture Silhouette for Scale */}
            <div className="absolute right-12 bottom-6 pointer-events-none opacity-20">
              <svg width="140" height="60" viewBox="0 0 140 60" fill="currentColor" className="text-charcoal">
                <rect x="10" y="15" width="120" height="35" rx="6" />
                <rect x="5" y="25" width="18" height="25" rx="4" />
                <rect x="117" y="25" width="18" height="25" rx="4" />
                <rect x="25" y="48" width="8" height="10" rx="1" />
                <rect x="107" y="48" width="8" height="10" rx="1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ambient Room Dimensions Annotation */}
        <div className="absolute bottom-3 right-6 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border text-xs text-muted shadow-sm flex items-center space-x-2">
          <span>Net Floor Area:</span>
          <span className="font-semibold text-charcoal">
            {floorSurface ? floorSurface.lengthFt * floorSurface.widthFt : 0} sq.ft
          </span>
          <span className="text-stone">|</span>
          <span>Click any surface to customize</span>
        </div>
      </div>
    </div>
  );
};
