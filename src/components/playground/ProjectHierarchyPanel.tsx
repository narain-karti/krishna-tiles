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
  MoreVertical,
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
    <aside className="w-72 bg-white border-r border-border flex flex-col h-full select-none shrink-0 overflow-hidden">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-border flex items-center justify-between bg-porcelain">
        <div className="flex items-center space-x-2">
          <Home className="w-4 h-4 text-brass" />
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal">
            Project Spaces
          </span>
        </div>

        <button
          onClick={() => setShowAddRoomModal(true)}
          className="flex items-center space-x-1 text-xs font-medium bg-charcoal text-ivory hover:bg-charcoal-soft px-2.5 py-1 rounded-md transition-colors"
          title="Add a new room to project"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Room</span>
        </button>
      </div>

      {/* Hierarchy Tree List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {project.rooms.map((room) => {
          const isRoomActive = activeRoomId === room.id;
          const isExpanded = expandedRooms[room.id] ?? true;

          // Room calculation summary
          const roomCalc = calculationResult.roomCalculations.find(r => r.roomId === room.id);

          return (
            <div key={room.id} className="rounded-xl border border-border/70 overflow-hidden bg-white shadow-subtle">
              {/* Room Header Row */}
              <div 
                onClick={() => {
                  setActiveRoomId(room.id);
                  if (room.surfaces.length > 0 && !room.surfaces.some(s => s.id === activeSurfaceId)) {
                    setActiveSurfaceId(room.surfaces[0].id);
                  }
                }}
                className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                  isRoomActive ? 'bg-[#F4EFE6] border-l-4 border-l-brass' : 'hover:bg-ivory-light'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRoomExpand(room.id);
                    }}
                    className="p-0.5 text-muted hover:text-charcoal"
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
                      className="text-xs font-semibold px-1 py-0.5 border border-brass rounded bg-white text-charcoal w-28"
                    />
                  ) : (
                    <span 
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingRoomId(room.id);
                        setEditingRoomName(room.name);
                      }}
                      className="text-xs font-semibold text-charcoal truncate"
                      title="Double click to rename room"
                    >
                      {room.name}
                    </span>
                  )}
                </div>

                {/* Room Quick Tools */}
                <div className="flex items-center space-x-1 shrink-0">
                  {roomCalc && (
                    <span className="text-[10px] font-mono font-medium text-muted">
                      {formatINR(roomCalc.totalMaterialCostINR)}
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateRoom(room.id);
                    }}
                    className="p-1 text-muted hover:text-charcoal rounded hover:bg-stone-light/50"
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
                    className="p-1 text-muted hover:text-red-600 rounded hover:bg-stone-light/50"
                    title="Delete Room"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Surfaces Sub-List */}
              {isExpanded && (
                <div className="px-2 py-1.5 bg-[#FAF9F6] border-t border-border/40 space-y-1">
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
                        className={`group px-2 py-1.5 rounded-lg flex items-center justify-between cursor-pointer text-xs transition-all ${
                          isSurfaceActive 
                            ? 'bg-white shadow-sm ring-1 ring-brass text-charcoal font-medium' 
                            : 'hover:bg-white/80 text-muted hover:text-charcoal'
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
                            <span className="block truncate leading-tight font-medium text-charcoal">
                              {surface.name}
                            </span>
                            <span className="text-[10px] text-muted block leading-none mt-0.5">
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
                            className="p-0.5 text-muted hover:text-charcoal"
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
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addSurface(room.id, 'wall', 'Additional Wall');
                      }}
                      className="w-full text-center py-1 text-[11px] font-medium text-brass hover:text-brass-dark hover:bg-brass-muted rounded transition-colors flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Surface to {room.name}</span>
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
        <div className="p-3 border-t border-border bg-porcelain">
          <div className="text-xs font-semibold text-charcoal mb-2">Select Room Template</div>
          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
            {roomTemplates.map((t) => (
              <button
                key={t.type}
                onClick={() => {
                  addRoom(t.type, t.label);
                  setShowAddRoomModal(false);
                }}
                className="text-left px-2 py-1.5 bg-white hover:bg-ivory rounded border border-border text-[11px] font-medium text-charcoal truncate transition-colors"
              >
                + {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddRoomModal(false)}
            className="w-full mt-2 text-center text-xs text-muted hover:text-charcoal py-1"
          >
            Cancel
          </button>
        </div>
      )}
    </aside>
  );
};
