import { Project } from '../types';

export const DEFAULT_PROJECT: Project = {
  id: 'proj-dream-home-01',
  title: 'Salem Villa — Complete Tile Plan',
  customerName: 'Karthik Subramanian',
  customerPhone: '9842109876',
  customerEmail: 'karthik.subramanian@gmail.com',
  targetBudget: 175000,
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
  notes: 'Independent residential house near Salem bypass. Focused on natural textures and Chettinad-modern fusion.',
  rooms: [
    // 1. Living Room
    {
      id: 'room-living',
      name: 'Grand Living Room',
      roomType: 'living',
      lengthFt: 18,
      widthFt: 14,
      heightFt: 10,
      surfaces: [
        {
          id: 'surf-lr-floor',
          name: 'Main Floor',
          surfaceType: 'floor',
          lengthFt: 18,
          widthFt: 14,
          openings: [],
          wastagePercentage: 10,
          assignedProductId: 'prod-statuario-1200', // Royal Statuario Gold
          layoutPattern: 'running-bond',
          orientationDeg: 0,
          groutWidthMm: 2,
          groutColorHex: '#E7DFD3',
          zones: [
            {
              id: 'zone-lr-border',
              name: 'Decorative Floor Inlay Rug',
              xPct: 20,
              yPct: 20,
              widthPct: 60,
              heightPct: 60,
              assignedProductId: 'prod-chettinad-accent',
            }
          ],
        },
        {
          id: 'surf-lr-featwall',
          name: 'TV Feature Wall',
          surfaceType: 'feature-wall',
          lengthFt: 18,
          widthFt: 10, // Height
          openings: [
            { id: 'op-lr-win', name: 'Courtyard Glass Window', widthFt: 6, heightFt: 4 }
          ],
          wastagePercentage: 8,
          assignedProductId: 'prod-charcoal-splitface', // Charcoal Slate Split Face
          layoutPattern: 'running-bond',
          orientationDeg: 0,
          groutWidthMm: 2,
          groutColorHex: '#29251F',
          zones: [],
        },
      ],
    },

    // 2. Kitchen
    {
      id: 'room-kitchen',
      name: 'Chef Kitchen',
      roomType: 'kitchen',
      lengthFt: 12,
      widthFt: 10,
      heightFt: 9.5,
      surfaces: [
        {
          id: 'surf-k-floor',
          name: 'Kitchen Floor',
          surfaceType: 'floor',
          lengthFt: 12,
          widthFt: 10,
          openings: [],
          wastagePercentage: 10,
          assignedProductId: 'prod-travertine-800', // Italian Travertine Navona
          layoutPattern: 'grid',
          orientationDeg: 0,
          groutWidthMm: 2,
          groutColorHex: '#D8D0C3',
          zones: [],
        },
        {
          id: 'surf-k-backsplash',
          name: 'Counter Backsplash',
          surfaceType: 'backsplash',
          lengthFt: 12,
          widthFt: 2.5,
          openings: [],
          wastagePercentage: 12,
          assignedProductId: 'prod-subway-emerald', // Emerald Green Beveled Subway
          layoutPattern: 'running-bond',
          orientationDeg: 0,
          groutWidthMm: 2,
          groutColorHex: '#FAF9F6',
          zones: [],
        },
      ],
    },

    // 3. Master Bedroom
    {
      id: 'room-bedroom',
      name: 'Master Bedroom',
      roomType: 'bedroom',
      lengthFt: 14,
      widthFt: 12,
      heightFt: 10,
      surfaces: [
        {
          id: 'surf-mbr-floor',
          name: 'Bedroom Floor',
          surfaceType: 'floor',
          lengthFt: 14,
          widthFt: 12,
          openings: [],
          wastagePercentage: 8,
          assignedProductId: 'prod-wood-plank-1200', // Nordic Natural Oak Wood Plank
          layoutPattern: 'running-bond',
          orientationDeg: 0,
          groutWidthMm: 2,
          groutColorHex: '#C0B7A7',
          zones: [],
        },
        {
          id: 'surf-mbr-accentwall',
          name: 'Bed Headboard Accent Wall',
          surfaceType: 'wall',
          lengthFt: 14,
          widthFt: 10,
          openings: [],
          wastagePercentage: 8,
          assignedProductId: 'prod-slate-2023', // Indian Autumn Slate Rectangle
          layoutPattern: 'grid',
          orientationDeg: 0,
          groutWidthMm: 3,
          groutColorHex: '#524B41',
          zones: [],
        },
      ],
    },

    // 4. Master Bathroom
    {
      id: 'room-bathroom',
      name: 'Master Ensuite Bathroom',
      roomType: 'bathroom',
      lengthFt: 8,
      widthFt: 6,
      heightFt: 9,
      surfaces: [
        {
          id: 'surf-bath-floor',
          name: 'Anti-Skid Shower Floor',
          surfaceType: 'floor',
          lengthFt: 8,
          widthFt: 6,
          openings: [],
          wastagePercentage: 10,
          assignedProductId: 'prod-white-antiskid', // Pure White Anti-Skid
          layoutPattern: 'grid',
          orientationDeg: 0,
          groutWidthMm: 2,
          groutColorHex: '#D8D0C3',
          zones: [],
        },
        {
          id: 'surf-bath-wall',
          name: 'Wet-Area Feature Wall',
          surfaceType: 'wall',
          lengthFt: 8,
          widthFt: 9,
          openings: [
            { id: 'op-bath-vent', name: 'Ventilator', widthFt: 2, heightFt: 2 }
          ],
          wastagePercentage: 10,
          assignedProductId: 'prod-floral-600', // Indian Autumn Slate Floral
          layoutPattern: 'grid',
          orientationDeg: 0,
          groutWidthMm: 2,
          groutColorHex: '#FAF9F6',
          zones: [],
        },
      ],
    },

    // 5. Verandah & Balcony
    {
      id: 'room-balcony',
      name: 'Verandah Balcony',
      roomType: 'balcony',
      lengthFt: 10,
      widthFt: 5,
      heightFt: 8,
      surfaces: [
        {
          id: 'surf-balc-floor',
          name: 'Outdoor Floor',
          surfaceType: 'floor',
          lengthFt: 10,
          widthFt: 5,
          openings: [],
          wastagePercentage: 12,
          assignedProductId: 'prod-iahtt-001', // Indian Autumn Slate Hexagon Terracotta
          layoutPattern: 'grid',
          orientationDeg: 0,
          groutWidthMm: 3,
          groutColorHex: '#8C3B23',
          zones: [],
        },
      ],
    },
  ],
};
