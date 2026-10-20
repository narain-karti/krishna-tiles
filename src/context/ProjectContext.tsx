import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Project, 
  Room, 
  Surface, 
  Product, 
  SurfaceType, 
  RoomType, 
  LayoutPattern,
  ProjectCalculationResult, 
  QuoteRequestSubmission,
  BusinessSettings,
  SurfaceZone
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_BUSINESS_SETTINGS } from '../data/products';
import { DEFAULT_PROJECT } from '../data/defaultProject';
import { calculateProjectEstimate } from '../utils/calculator';

export type ViewMode = 'room_preview' | 'surface_plan' | 'wall_elevation' | 'material_board' | 'budget_planner';

interface ProjectContextType {
  project: Project;
  products: Product[];
  productsMap: Map<string, Product>;
  activeRoomId: string;
  activeSurfaceId: string;
  activeViewMode: ViewMode;
  businessSettings: BusinessSettings;
  quoteRequests: QuoteRequestSubmission[];
  saveStatus: 'saved' | 'saving' | 'unsaved';
  canUndo: boolean;
  canRedo: boolean;

  // Navigation & View controls
  setActiveRoomId: (id: string) => void;
  setActiveSurfaceId: (id: string) => void;
  setActiveViewMode: (mode: ViewMode) => void;

  // History controls
  undo: () => void;
  redo: () => void;

  // Project Actions
  updateProjectDetails: (updates: Partial<Pick<Project, 'title' | 'targetBudget' | 'notes' | 'options'>>) => void;
  resetProjectToDefault: () => void;
  resetProjectToBlank: () => void;
  loadInspirationProject: (productIds: string[], roomTitle: string) => void;

  // Room Actions
  addRoom: (roomType: RoomType, customName?: string) => string;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  duplicateRoom: (roomId: string) => void;
  deleteRoom: (roomId: string) => void;

  // Surface Actions
  addSurface: (roomId: string, surfaceType: SurfaceType, customName?: string) => string;
  updateSurface: (roomId: string, surfaceId: string, updates: Partial<Surface>) => void;
  duplicateSurface: (roomId: string, surfaceId: string) => void;
  deleteSurface: (roomId: string, surfaceId: string) => void;
  assignTileToSurface: (roomId: string, surfaceId: string, productId: string) => void;

  // Zone Actions
  addSurfaceZone: (roomId: string, surfaceId: string, zone: Omit<SurfaceZone, 'id'>) => void;
  updateSurfaceZone: (roomId: string, surfaceId: string, zoneId: string, updates: Partial<SurfaceZone>) => void;
  deleteSurfaceZone: (roomId: string, surfaceId: string, zoneId: string) => void;
  splitSurfaceZone: (roomId: string, surfaceId: string, orientation: 'horizontal' | 'vertical', ratio?: number) => void;

  // Admin & Catalogue Actions
  addOrUpdateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  bulkUpdatePrices: (percentageChange: number) => void;
  updateBusinessSettings: (settings: BusinessSettings) => void;

  // Quotation Actions
  submitQuoteRequest: (quote: Omit<QuoteRequestSubmission, 'id' | 'createdAt' | 'status'>) => QuoteRequestSubmission;
  updateQuoteStatus: (quoteId: string, status: QuoteRequestSubmission['status'], adminNotes?: string) => void;

  // Derived Calculations
  calculationResult: ProjectCalculationResult;
  activeRoom: Room | undefined;
  activeSurface: Surface | undefined;
}

const STORAGE_KEY_PROJECT = 'kt_active_project_v1';
const STORAGE_KEY_PRODUCTS = 'kt_products_v1';
const STORAGE_KEY_SETTINGS = 'kt_business_settings_v1';
const STORAGE_KEY_QUOTES = 'kt_quotes_v1';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial products from localStorage or default
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Load business settings
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_BUSINESS_SETTINGS;
  });

  // Load quotes
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUOTES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Load active project
  const [project, setProjectInternal] = useState<Project>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECT);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PROJECT;
  });

  // Undo / Redo history stacks
  const [historyPast, setHistoryPast] = useState<Project[]>([]);
  const [historyFuture, setHistoryFuture] = useState<Project[]>([]);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // UI state
  const [activeRoomId, setActiveRoomId] = useState<string>(() => project.rooms[0]?.id || '');
  const [activeSurfaceId, setActiveSurfaceId] = useState<string>(() => project.rooms[0]?.surfaces[0]?.id || '');
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>('room_preview');

  // Products Map for fast lookups
  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach(p => map.set(p.id, p));
    return map;
  }, [products]);

  // Derived calculation result
  const calculationResult = useMemo(() => {
    return calculateProjectEstimate(project, productsMap);
  }, [project, productsMap]);

  // Active room and surface references
  const activeRoom = useMemo(() => {
    return project.rooms.find(r => r.id === activeRoomId) || project.rooms[0];
  }, [project.rooms, activeRoomId]);

  const activeSurface = useMemo(() => {
    if (!activeRoom) return undefined;
    return activeRoom.surfaces.find(s => s.id === activeSurfaceId) || activeRoom.surfaces[0];
  }, [activeRoom, activeSurfaceId]);

  // Auto-save project with a 400ms debounce
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(project));
        setSaveStatus('saved');
      } catch {
        setSaveStatus('unsaved');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [project]);

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch {}
  }, [products]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(businessSettings));
    } catch {}
  }, [businessSettings]);

  // Persist quotes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quoteRequests));
    } catch {}
  }, [quoteRequests]);

  // Ensure activeRoomId and activeSurfaceId are valid when rooms change
  useEffect(() => {
    if (project.rooms.length > 0) {
      const roomExists = project.rooms.some(r => r.id === activeRoomId);
      if (!roomExists) {
        const firstRoom = project.rooms[0];
        setActiveRoomId(firstRoom.id);
        if (firstRoom.surfaces.length > 0) {
          setActiveSurfaceId(firstRoom.surfaces[0].id);
        }
      } else {
        const currentRoom = project.rooms.find(r => r.id === activeRoomId);
        if (currentRoom && currentRoom.surfaces.length > 0) {
          const surfExists = currentRoom.surfaces.some(s => s.id === activeSurfaceId);
          if (!surfExists) {
            setActiveSurfaceId(currentRoom.surfaces[0].id);
          }
        }
      }
    }
  }, [project.rooms, activeRoomId, activeSurfaceId]);

  // Project updater with undo capture
  const setProject = useCallback((newProject: Project | ((prev: Project) => Project), skipHistory = false) => {
    setProjectInternal(prev => {
      const resolved = typeof newProject === 'function' ? newProject(prev) : newProject;
      if (!skipHistory) {
        setHistoryPast(past => [...past.slice(-20), prev]);
        setHistoryFuture([]);
      }
      return {
        ...resolved,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const undo = useCallback(() => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast(past => past.slice(0, past.length - 1));
    setHistoryFuture(future => [project, ...future]);
    setProjectInternal(previous);
  }, [historyPast, project]);

  const redo = useCallback(() => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    setHistoryFuture(future => future.slice(1));
    setHistoryPast(past => [...past, project]);
    setProjectInternal(next);
  }, [historyFuture, project]);

  const updateProjectDetails = useCallback((updates: Partial<Pick<Project, 'title' | 'targetBudget' | 'notes' | 'options'>>) => {
    setProject(prev => ({
      ...prev,
      ...updates,
      options: updates.options ? { ...prev.options, ...updates.options } : prev.options,
    }));
  }, [setProject]);

  const resetProjectToDefault = useCallback(() => {
    setProject(DEFAULT_PROJECT);
    setActiveRoomId(DEFAULT_PROJECT.rooms[0].id);
    setActiveSurfaceId(DEFAULT_PROJECT.rooms[0].surfaces[0].id);
  }, [setProject]);

  const resetProjectToBlank = useCallback(() => {
    const blankRoom: Room = {
      id: 'room-' + Date.now(),
      name: 'Main Space',
      roomType: 'custom',
      lengthFt: 15,
      widthFt: 12,
      heightFt: 10,
      surfaces: [
        {
          id: 'surf-' + Date.now(),
          name: 'Main Floor',
          surfaceType: 'floor',
          lengthFt: 15,
          widthFt: 12,
          openings: [],
          wastagePercentage: 10,
          layoutPattern: 'grid',
          orientationDeg: 0,
          groutWidthMm: 2,
          groutColorHex: '#D8D0C3',
          zones: [],
        }
      ]
    };

    const blankProject: Project = {
      id: 'proj-' + Date.now(),
      title: 'New Tile Project',
      rooms: [blankRoom],
      options: {
        includeAdhesive: true,
        adhesiveBagCostINR: 450,
        includeGrout: true,
        groutKgCostINR: 120,
        includeInstallationLabour: false,
        labourRatePerSqFtINR: 35,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProject(blankProject);
    setActiveRoomId(blankRoom.id);
    setActiveSurfaceId(blankRoom.surfaces[0].id);
  }, [setProject]);

  const loadInspirationProject = useCallback((productIds: string[], roomTitle: string) => {
    const p1 = productIds[0] || 'prod-statuario-1200';
    const p2 = productIds[1] || 'prod-charcoal-splitface';

    const inspRoom: Room = {
      id: 'room-' + Date.now(),
      name: roomTitle,
      roomType: 'living',
      lengthFt: 16,
      widthFt: 14,
      heightFt: 10,
      surfaces: [
        {
          id: 'surf-' + Date.now() + '-1',
          name: 'Main Floor',
          surfaceType: 'floor',
          lengthFt: 16,
          widthFt: 14,
          openings: [],
          wastagePercentage: 10,
          assignedProductId: p1,
          layoutPattern: 'running-bond',
          orientationDeg: 0,
          groutWidthMm: 2,
          groutColorHex: '#E7DFD3',
          zones: [],
        },
        {
          id: 'surf-' + Date.now() + '-2',
          name: 'Accent Wall',
          surfaceType: 'feature-wall',
          lengthFt: 16,
          widthFt: 10,
          openings: [],
          wastagePercentage: 10,
          assignedProductId: p2,
          layoutPattern: 'grid',
          orientationDeg: 0,
          groutWidthMm: 2,
          groutColorHex: '#29251F',
          zones: [],
        }
      ]
    };

    setProject(prev => ({
      ...prev,
      rooms: [inspRoom, ...prev.rooms],
    }));

    setActiveRoomId(inspRoom.id);
    setActiveSurfaceId(inspRoom.surfaces[0].id);
    setActiveViewMode('room_preview');
  }, [setProject]);

  // Room CRUD
  const addRoom = useCallback((roomType: RoomType, customName?: string): string => {
    const newRoomId = 'room-' + Date.now();
    const defaultsByType: Record<RoomType, { name: string; l: number; w: number; h: number; surfaces: { type: SurfaceType; name: string }[] }> = {
      living: { name: 'Living Room', l: 18, w: 14, h: 10, surfaces: [{ type: 'floor', name: 'Main Floor' }, { type: 'feature-wall', name: 'Feature Wall' }] },
      kitchen: { name: 'Kitchen', l: 12, w: 10, h: 9.5, surfaces: [{ type: 'floor', name: 'Kitchen Floor' }, { type: 'backsplash', name: 'Backsplash' }] },
      bedroom: { name: 'Bedroom', l: 14, w: 12, h: 10, surfaces: [{ type: 'floor', name: 'Main Floor' }, { type: 'wall', name: 'Accent Wall' }] },
      bathroom: { name: 'Bathroom', l: 8, w: 6, h: 9, surfaces: [{ type: 'floor', name: 'Anti-Skid Floor' }, { type: 'wall', name: 'Wet Area Wall' }] },
      balcony: { name: 'Balcony', l: 10, w: 5, h: 8, surfaces: [{ type: 'floor', name: 'Balcony Floor' }] },
      terrace: { name: 'Terrace', l: 20, w: 15, h: 3.5, surfaces: [{ type: 'floor', name: 'Terrace Floor' }] },
      staircase: { name: 'Staircase', l: 12, w: 4, h: 10, surfaces: [{ type: 'floor', name: 'Treads & Risers' }] },
      exterior: { name: 'Exterior Facade', l: 24, w: 12, h: 12, surfaces: [{ type: 'wall', name: 'Main Elevation' }] },
      commercial: { name: 'Office Hall', l: 25, w: 20, h: 11, surfaces: [{ type: 'floor', name: 'Hall Floor' }] },
      custom: { name: 'Custom Space', l: 12, w: 12, h: 10, surfaces: [{ type: 'floor', name: 'Floor Surface' }] },
    };

    const config = defaultsByType[roomType] || defaultsByType.custom;
    const roomName = customName || config.name;

    const initialSurfaces: Surface[] = config.surfaces.map((s, idx) => ({
      id: `surf-${newRoomId}-${idx + 1}`,
      name: s.name,
      surfaceType: s.type,
      lengthFt: config.l,
      widthFt: s.type === 'backsplash' ? 2.5 : (s.type === 'wall' || s.type === 'feature-wall' ? config.h : config.w),
      openings: [],
      wastagePercentage: businessSettings.defaultWastagePercentage || 10,
      layoutPattern: 'grid',
      orientationDeg: 0,
      groutWidthMm: 2,
      groutColorHex: '#D8D0C3',
      zones: [],
    }));

    const newRoom: Room = {
      id: newRoomId,
      name: roomName,
      roomType,
      lengthFt: config.l,
      widthFt: config.w,
      heightFt: config.h,
      surfaces: initialSurfaces,
    };

    setProject(prev => ({
      ...prev,
      rooms: [...prev.rooms, newRoom],
    }));

    setActiveRoomId(newRoomId);
    if (initialSurfaces.length > 0) {
      setActiveSurfaceId(initialSurfaces[0].id);
    }

    return newRoomId;
  }, [setProject, businessSettings.defaultWastagePercentage]);

  const updateRoom = useCallback((roomId: string, updates: Partial<Room>) => {
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => room.id === roomId ? { ...room, ...updates } : room),
    }));
  }, [setProject]);

  const duplicateRoom = useCallback((roomId: string) => {
    const roomToClone = project.rooms.find(r => r.id === roomId);
    if (!roomToClone) return;

    const clonedRoomId = 'room-' + Date.now();
    const clonedRoom: Room = {
      ...roomToClone,
      id: clonedRoomId,
      name: `${roomToClone.name} (Copy)`,
      surfaces: roomToClone.surfaces.map(s => ({
        ...s,
        id: `surf-${clonedRoomId}-${Math.random().toString(36).substr(2, 6)}`,
        zones: s.zones.map(z => ({
          ...z,
          id: `zone-${Math.random().toString(36).substr(2, 6)}`,
        })),
      })),
    };

    setProject(prev => ({
      ...prev,
      rooms: [...prev.rooms, clonedRoom],
    }));

    setActiveRoomId(clonedRoomId);
  }, [project.rooms, setProject]);

  const deleteRoom = useCallback((roomId: string) => {
    if (project.rooms.length <= 1) {
      alert('Your project must have at least one room.');
      return;
    }
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.filter(r => r.id !== roomId),
    }));
  }, [project.rooms.length, setProject]);

  // Surface CRUD
  const addSurface = useCallback((roomId: string, surfaceType: SurfaceType, customName?: string): string => {
    const newSurfaceId = 'surf-' + Date.now();
    const room = project.rooms.find(r => r.id === roomId);
    const defaultName = customName || `${surfaceType.charAt(0).toUpperCase() + surfaceType.slice(1)} Surface`;

    const newSurface: Surface = {
      id: newSurfaceId,
      name: defaultName,
      surfaceType,
      lengthFt: room ? room.lengthFt : 12,
      widthFt: surfaceType === 'backsplash' ? 2.5 : (surfaceType === 'wall' || surfaceType === 'feature-wall' ? (room?.heightFt || 10) : (room?.widthFt || 10)),
      openings: [],
      wastagePercentage: businessSettings.defaultWastagePercentage || 10,
      layoutPattern: 'grid',
      orientationDeg: 0,
      groutWidthMm: 2,
      groutColorHex: '#D8D0C3',
      zones: [],
    };

    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, surfaces: [...r.surfaces, newSurface] } : r),
    }));

    setActiveSurfaceId(newSurfaceId);
    return newSurfaceId;
  }, [project.rooms, setProject, businessSettings.defaultWastagePercentage]);

  const updateSurface = useCallback((roomId: string, surfaceId: string, updates: Partial<Surface>) => {
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => {
        if (room.id !== roomId) return room;
        return {
          ...room,
          surfaces: room.surfaces.map(surface => {
            if (surface.id !== surfaceId) return surface;
            return { ...surface, ...updates };
          }),
        };
      }),
    }));
  }, [setProject]);

  const duplicateSurface = useCallback((roomId: string, surfaceId: string) => {
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => {
        if (room.id !== roomId) return room;
        const surf = room.surfaces.find(s => s.id === surfaceId);
        if (!surf) return room;
        const cloned: Surface = {
          ...surf,
          id: 'surf-' + Date.now(),
          name: `${surf.name} (Copy)`,
          zones: surf.zones.map(z => ({ ...z, id: 'zone-' + Math.random().toString(36).substr(2, 6) })),
        };
        return { ...room, surfaces: [...room.surfaces, cloned] };
      }),
    }));
  }, [setProject]);

  const deleteSurface = useCallback((roomId: string, surfaceId: string) => {
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => {
        if (room.id !== roomId) return room;
        if (room.surfaces.length <= 1) {
          alert('A room must contain at least one surface.');
          return room;
        }
        return {
          ...room,
          surfaces: room.surfaces.filter(s => s.id !== surfaceId),
        };
      }),
    }));
  }, [setProject]);

  const assignTileToSurface = useCallback((roomId: string, surfaceId: string, productId: string) => {
    updateSurface(roomId, surfaceId, { assignedProductId: productId });
  }, [updateSurface]);

  // Zone Operations (Multi-zone tile assignment)
  const addSurfaceZone = useCallback((roomId: string, surfaceId: string, zone: Omit<SurfaceZone, 'id'>) => {
    const newZone: SurfaceZone = {
      ...zone,
      id: 'zone-' + Date.now(),
    };

    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => {
        if (room.id !== roomId) return room;
        return {
          ...room,
          surfaces: room.surfaces.map(surface => {
            if (surface.id !== surfaceId) return surface;
            return {
              ...surface,
              zones: [...surface.zones, newZone],
            };
          }),
        };
      }),
    }));
  }, [setProject]);

  const updateSurfaceZone = useCallback((roomId: string, surfaceId: string, zoneId: string, updates: Partial<SurfaceZone>) => {
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => {
        if (room.id !== roomId) return room;
        return {
          ...room,
          surfaces: room.surfaces.map(surface => {
            if (surface.id !== surfaceId) return surface;
            return {
              ...surface,
              zones: surface.zones.map(zone => zone.id === zoneId ? { ...zone, ...updates } : zone),
            };
          }),
        };
      }),
    }));
  }, [setProject]);

  const deleteSurfaceZone = useCallback((roomId: string, surfaceId: string, zoneId: string) => {
    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => {
        if (room.id !== roomId) return room;
        return {
          ...room,
          surfaces: room.surfaces.map(surface => {
            if (surface.id !== surfaceId) return surface;
            return {
              ...surface,
              zones: surface.zones.filter(zone => zone.id !== zoneId),
            };
          }),
        };
      }),
    }));
  }, [setProject]);

  const splitSurfaceZone = useCallback((
    roomId: string, 
    surfaceId: string, 
    orientation: 'horizontal' | 'vertical', 
    ratio = 50
  ) => {
    const splitRatio = Math.max(10, Math.min(90, ratio));

    const zone1: SurfaceZone = {
      id: 'zone-' + Date.now() + '-1',
      name: orientation === 'horizontal' ? 'Top Section' : 'Left Section',
      xPct: 0,
      yPct: 0,
      widthPct: orientation === 'horizontal' ? 100 : splitRatio,
      heightPct: orientation === 'horizontal' ? splitRatio : 100,
    };

    const zone2: SurfaceZone = {
      id: 'zone-' + Date.now() + '-2',
      name: orientation === 'horizontal' ? 'Bottom Section' : 'Right Section',
      xPct: orientation === 'horizontal' ? 0 : splitRatio,
      yPct: orientation === 'horizontal' ? splitRatio : 0,
      widthPct: orientation === 'horizontal' ? 100 : 100 - splitRatio,
      heightPct: orientation === 'horizontal' ? 100 - splitRatio : 100,
    };

    setProject(prev => ({
      ...prev,
      rooms: prev.rooms.map(room => {
        if (room.id !== roomId) return room;
        return {
          ...room,
          surfaces: room.surfaces.map(surface => {
            if (surface.id !== surfaceId) return surface;
            return {
              ...surface,
              zones: [zone1, zone2],
            };
          }),
        };
      }),
    }));
  }, [setProject]);

  // Admin & Catalogue management
  const addOrUpdateProduct = useCallback((product: Product) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...product, lastPriceUpdate: new Date().toISOString().split('T')[0] };
        return updated;
      }
      return [...prev, { ...product, lastPriceUpdate: new Date().toISOString().split('T')[0] }];
    });
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const bulkUpdatePrices = useCallback((percentageChange: number) => {
    if (isNaN(percentageChange) || percentageChange === 0) return;
    const factor = 1 + percentageChange / 100;
    setProducts(prev => prev.map(p => {
      if (p.pricePerUnit !== undefined && p.pricePerUnit > 0) {
        return {
          ...p,
          pricePerUnit: Math.round(p.pricePerUnit * factor),
          lastPriceUpdate: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    }));
  }, []);

  const updateBusinessSettings = useCallback((settings: BusinessSettings) => {
    setBusinessSettings(settings);
  }, []);

  // Quotes
  const submitQuoteRequest = useCallback((quoteData: Omit<QuoteRequestSubmission, 'id' | 'createdAt' | 'status'>) => {
    const newQuote: QuoteRequestSubmission = {
      ...quoteData,
      id: 'quote-' + Date.now(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setQuoteRequests(prev => [newQuote, ...prev]);
    return newQuote;
  }, []);

  const updateQuoteStatus = useCallback((quoteId: string, status: QuoteRequestSubmission['status'], adminNotes?: string) => {
    setQuoteRequests(prev => prev.map(q => {
      if (q.id !== quoteId) return q;
      return {
        ...q,
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : q.adminNotes,
      };
    }));
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        project,
        products,
        productsMap,
        activeRoomId,
        activeSurfaceId,
        activeViewMode,
        businessSettings,
        quoteRequests,
        saveStatus,
        canUndo: historyPast.length > 0,
        canRedo: historyFuture.length > 0,
        setActiveRoomId,
        setActiveSurfaceId,
        setActiveViewMode,
        undo,
        redo,
        updateProjectDetails,
        resetProjectToDefault,
        resetProjectToBlank,
        loadInspirationProject,
        addRoom,
        updateRoom,
        duplicateRoom,
        deleteRoom,
        addSurface,
        updateSurface,
        duplicateSurface,
        deleteSurface,
        assignTileToSurface,
        addSurfaceZone,
        updateSurfaceZone,
        deleteSurfaceZone,
        splitSurfaceZone,
        addOrUpdateProduct,
        deleteProduct,
        bulkUpdatePrices,
        updateBusinessSettings,
        submitQuoteRequest,
        updateQuoteStatus,
        calculationResult,
        activeRoom,
        activeSurface,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
