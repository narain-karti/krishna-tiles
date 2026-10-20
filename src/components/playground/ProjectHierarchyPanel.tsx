import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { RoomType, SurfaceType } from '../../types';
import { getTileBackgroundStyle } from '../../utils/tileRenderer';
import { formatINR } from '../../utils/calculator';
import { 
  FolderPlus, 
  Layers, 
  Plus, 
  Copy, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Home, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProjectHierarchyPanel: React.FC = () => {
  const {
    project,
    activeRoomId,
    setActiveRoomId,
    activeSurfaceId,
    setActiveSurfaceId,
    addRoom,
    updateRoom,
    duplicateRoom,
    deleteRoom,
    addSurface,
    duplicateSurface,
    deleteSurface,
    productsMap,
    calculationResult,
  } = useProject();

  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    project.rooms.forEach(r => { init[r.id] = true; });
    return init;
  });

  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editingRoomName, setEditingRoomName] = useState('');

  const toggleRoomExpand = (roomId: string) => {
    setExpandedRooms(prev => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const roomTemplates: { type: RoomType; label: string }[] = [
    { type: 'living', label: 'Living Room' },
    { type: 'kitchen', label: 'Chef Kitchen' },
    { type: 'bedroom', label: 'Bedroom Suite' },
    { type: 'bathroom', label: 'Ensuite Bathroom' },
    { type: 'balcony', label: 'Balcony / Verandah' },
    { type: 'terrace', label: 'Terrace Roof' },
    { type: 'staircase', label: 'Staircase' },
    { type: 'exterior', label: 'Elevation Facade' },
    { type: 'commercial', label: 'Commercial Space' },
    { type: 'custom', label: 'Custom Room' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-border flex flex-col h-full select-none shrink-0 overflow-hidden font-sans">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-border flex items-center justify-between bg-[#F8F8FA]">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-neon" />
          <span className="text-xs font-bold uppercase tracking-wider text-carbon">
            Project Spaces
          </span>
        </div>

        <button
          onClick={() => setShowAddRoomModal(true)}
          className="flex items-center space-x-1 text-xs font-bold bg-carbon text-white hover:bg-neon hover:text-carbon px-3 py-1 rounded-full transition-colors"
          title="Add a new room to project"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Room</span>
        </button>
      </div>

      {/* Hierarchy Tree List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {project.rooms.map((room) => {
          const isRoomActive = activeRoomId === room.id;
          const isExpanded = expandedRooms[room.id] ?? true;

          // Room calculation summary
          const roomCalc = calculationResult.roomCalculations.find(r => r.roomId === room.id);

          return (
            <div key={room.id} className="rounded-2xl border border-border overflow-hidden bg-white shadow-subtle">
              {/* Room Header Row */}
              <div 
                onClick={() => {
                  setActiveRoomId(room.id);
                  if (room.surfaces.length > 0 && !room.surfaces.some(s => s.id === activeSurfaceId)) {
                    setActiveSurfaceId(room.surfaces[0].id);
                  }
                }}
                className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                  isRoomActive ? 'bg-carbon text-white' : 'hover:bg-stone-light/30 text-carbon'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRoomExpand(room.id);
                    }}
                    className={`p-0.5 ${isRoomActive ? 'text-white' : 'text-muted hover:text-carbon'}`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {editingRoomId === room.id ? (
                    <input
                      type="text"
                      value={editingRoomName}
                      onChange={(e) => setEditingRoomName(e.target.value)}
                      onBlur={() => {
                        if (editingRoomName.trim()) {
                          updateRoom(room.id, { name: editingRoomName.trim() });
                        }
                        setEditingRoomId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editingRoomName.trim()) {
                            updateRoom(room.id, { name: editingRoomName.trim() });
                          }
                          setEditingRoomId(null);
                        }
                      }}
                      autoFocus
                      className="text-xs font-bold px-2 py-0.5 border border-neon rounded bg-white text-carbon w-28"
                    />
                  ) : (
                    <span 
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingRoomId(room.id);
                        setEditingRoomName(room.name);
                      }}
                      className="text-xs font-bold truncate"
                      title="Double click to rename room"
                    >
                      {room.name}
                    </span>
                  )}
                </div>

                {/* Room Quick Tools */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  {roomCalc && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${isRoomActive ? 'bg-white/20 text-neon' : 'bg-stone-light text-carbon'}`}>
                      {formatINR(roomCalc.totalMaterialCostINR)}
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateRoom(room.id);
                    }}
                    className={`p-1 rounded ${isRoomActive ? 'text-white/80 hover:text-white' : 'text-muted hover:text-carbon'}`}
                    title="Duplicate Room"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete ${room.name}? This can be undone.`)) {
                        deleteRoom(room.id);
                      }
                    }}
                    className={`p-1 rounded ${isRoomActive ? 'text-white/80 hover:text-rose-400' : 'text-muted hover:text-red-600'}`}
                    title="Delete Room"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Surfaces Sub-List */}
              {isExpanded && (
                <div className="px-2 py-2 bg-[#F8F8FA] border-t border-border/40 space-y-1.5">
                  {room.surfaces.map((surface) => {
                    const isSurfaceActive = activeSurfaceId === surface.id;
                    const product = surface.assignedProductId ? productsMap.get(surface.assignedProductId) : undefined;
                    const surfaceArea = surface.lengthFt * surface.widthFt;

                    const swatchStyle = getTileBackgroundStyle(product, 'grid', 2, '#D8D0C3', 0);

                    return (
                      <div
                        key={surface.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRoomId(room.id);
                          setActiveSurfaceId(surface.id);
                        }}
                        className={`group px-2.5 py-2 rounded-xl flex items-center justify-between cursor-pointer text-xs transition-all ${
                          isSurfaceActive 
                            ? 'bg-carbon text-white shadow-md ring-2 ring-neon font-bold' 
                            : 'hover:bg-white text-muted hover:text-carbon bg-white/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {/* Mini Tile Swatch */}
                          <div 
                            className="w-5 h-5 rounded border border-border shrink-0 shadow-inner"
                            style={{
                              ...swatchStyle,
                              backgroundSize: '12px 12px',
                            }}
                            title={product?.name || 'No tile selected'}
                          />

                          <div className="truncate">
                            <span className={`block truncate leading-tight font-bold ${isSurfaceActive ? 'text-white' : 'text-carbon'}`}>
                              {surface.name}
                            </span>
                            <span className={`text-[10px] block leading-none mt-0.5 ${isSurfaceActive ? 'text-muted-light' : 'text-muted'}`}>
                              {surfaceArea} sq.ft • {product ? product.name : 'No Tile'}
                            </span>
                          </div>
                        </div>

                        {/* Surface Actions */}
                        <div className="flex items-center space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateSurface(room.id, surface.id);
                            }}
                            className={`p-0.5 ${isSurfaceActive ? 'text-white' : 'text-muted hover:text-carbon'}`}
                            title="Duplicate surface"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSurface(room.id, surface.id);
                            }}
                            className="p-0.5 text-muted hover:text-red-600"
                            title="Delete surface"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Surface Button inside room */}
                  <div className="pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addSurface(room.id, 'wall', 'Additional Wall');
                      }}
                      className="w-full text-center py-1.5 text-[11px] font-bold text-carbon hover:bg-stone-light/60 rounded-full transition-colors flex items-center justify-center space-x-1 border border-dashed border-border"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Surface</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Room Modal / Flyout */}
      {showAddRoomModal && (
        <div className="p-4 border-t border-border bg-[#F8F8FA]">
          <div className="text-xs font-bold text-carbon mb-2">Select Space Template</div>
          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
            {roomTemplates.map((t) => (
              <button
                key={t.type}
                onClick={() => {
                  addRoom(t.type, t.label);
                  setShowAddRoomModal(false);
                }}
                className="text-left px-2.5 py-1.5 bg-white hover:bg-neon hover:text-carbon rounded-full border border-border text-[11px] font-bold text-carbon truncate transition-colors"
              >
                + {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddRoomModal(false)}
            className="w-full mt-2 text-center text-xs text-muted hover:text-carbon py-1"
          >
            Cancel
          </button>
        </div>
      )}
    </aside>
  );
};
