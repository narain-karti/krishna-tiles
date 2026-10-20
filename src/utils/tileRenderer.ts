import { Product, LayoutPattern } from '../types';

/**
 * Procedural SVG pattern generator for real architectural tile rendering.
 * Generates true-to-aspect-ratio tile patterns with realistic textures (marble veining,
 * wood grain, slate clefts, terracotta warmth, flamed granite stipples, and beveled subway tiles)
 * and configurable grout widths & colors.
 */
export function generateTilePatternSvg(
  product: Product,
  options: {
    groutWidthMm?: number;
    groutColorHex?: string;
    layoutPattern?: LayoutPattern;
    scale?: number; // scale factor
  } = {}
): string {
  const groutWidth = Math.max(1, Math.min(6, options.groutWidthMm || 2));
  const groutColor = options.groutColorHex || '#D8D0C3';
  const pattern = options.layoutPattern || 'grid';

  const w = product.dimensions.widthMm || 600;
  const h = product.dimensions.heightMm || 600;

  // Normalize dimensions to viewbox units (e.g. 1 unit ~ 5mm)
  const unitScale = 0.2;
  const tileW = Math.max(20, Math.round(w * unitScale));
  const tileH = Math.max(20, Math.round(h * unitScale));
  const groutPx = Math.max(1, Math.round(groutWidth * unitScale * 2));

  const baseColor = product.colorHex || '#F3EEE5';
  const accentColor = product.accentColorHex || '#B89A63';

  // SVG Texture filter or inner elements based on patternType
  let textureMarkup = '';

  switch (product.patternType) {
    case 'marble':
      textureMarkup = `
        <path d="M 0,${tileH * 0.2} Q ${tileW * 0.4},${tileH * 0.5} ${tileW * 0.8},${tileH * 0.1} T ${tileW},${tileH * 0.7}" fill="none" stroke="${accentColor}" stroke-width="1.5" opacity="0.35" />
        <path d="M ${tileW * 0.2},0 Q ${tileW * 0.5},${tileH * 0.4} ${tileW * 0.3},${tileH} " fill="none" stroke="${accentColor}" stroke-width="0.8" opacity="0.25" />
        <circle cx="${tileW * 0.7}" cy="${tileH * 0.6}" r="${tileW * 0.3}" fill="${accentColor}" opacity="0.04" />
      `;
      break;

    case 'wood':
      textureMarkup = `
        <line x1="0" y1="${tileH * 0.25}" x2="${tileW}" y2="${tileH * 0.25}" stroke="${accentColor}" stroke-width="0.75" opacity="0.4" stroke-dasharray="20,5,40,10" />
        <line x1="0" y1="${tileH * 0.5}" x2="${tileW}" y2="${tileH * 0.5}" stroke="${accentColor}" stroke-width="1" opacity="0.3" stroke-dasharray="35,15,50,5" />
        <line x1="0" y1="${tileH * 0.75}" x2="${tileW}" y2="${tileH * 0.75}" stroke="${accentColor}" stroke-width="0.75" opacity="0.4" stroke-dasharray="15,10,30,8" />
        <ellipse cx="${tileW * 0.5}" cy="${tileH * 0.5}" rx="${tileW * 0.15}" ry="${tileH * 0.2}" fill="none" stroke="${accentColor}" stroke-width="0.5" opacity="0.3" />
      `;
      break;

    case 'stone':
    case 'solid':
      textureMarkup = `
        <circle cx="${tileW * 0.25}" cy="${tileH * 0.3}" r="1.5" fill="${accentColor}" opacity="0.4" />
        <circle cx="${tileW * 0.7}" cy="${tileH * 0.2}" r="2" fill="${accentColor}" opacity="0.35" />
        <circle cx="${tileW * 0.4}" cy="${tileH * 0.7}" r="1.2" fill="${accentColor}" opacity="0.4" />
        <circle cx="${tileW * 0.85}" cy="${tileH * 0.8}" r="1.8" fill="${accentColor}" opacity="0.3" />
        <rect x="0" y="0" width="${tileW}" height="${tileH}" fill="url(#stoneGradient)" opacity="0.15" />
      `;
      break;

    case 'subway':
      textureMarkup = `
        <rect x="1" y="1" width="${tileW - 2}" height="${tileH - 2}" rx="1" fill="none" stroke="white" stroke-width="1.5" opacity="0.6" />
        <rect x="3" y="3" width="${tileW - 6}" height="${tileH - 6}" rx="1" fill="${accentColor}" opacity="0.1" />
      `;
      break;

    case 'geometric':
    case 'floral':
      textureMarkup = `
        <circle cx="${tileW / 2}" cy="${tileH / 2}" r="${Math.min(tileW, tileH) * 0.35}" fill="none" stroke="${accentColor}" stroke-width="1.5" opacity="0.5" />
        <circle cx="${tileW / 2}" cy="${tileH / 2}" r="${Math.min(tileW, tileH) * 0.15}" fill="${accentColor}" opacity="0.25" />
        <path d="M 0 0 L ${tileW} ${tileH} M ${tileW} 0 L 0 ${tileH}" stroke="${accentColor}" stroke-width="0.75" opacity="0.3" />
      `;
      break;

    default:
      textureMarkup = `<rect x="0" y="0" width="${tileW}" height="${tileH}" fill="${baseColor}" />`;
  }

  let patternW = tileW + groutPx;
  let patternH = tileH + groutPx;
  let tilesLayout = '';

  if (pattern === 'running-bond') {
    // Staggered pattern: 2 rows high, row 2 offset by 50%
    patternH = (tileH + groutPx) * 2;
    tilesLayout = `
      <!-- Row 1 -->
      <g transform="translate(0, 0)">
        <rect width="${tileW}" height="${tileH}" fill="${baseColor}" />
        ${textureMarkup}
      </g>
      <!-- Row 2 (offset) -->
      <g transform="translate(${-tileW / 2}, ${tileH + groutPx})">
        <rect width="${tileW}" height="${tileH}" fill="${baseColor}" />
        ${textureMarkup}
      </g>
      <g transform="translate(${tileW / 2 + groutPx}, ${tileH + groutPx})">
        <rect width="${tileW}" height="${tileH}" fill="${baseColor}" />
        ${textureMarkup}
      </g>
    `;
  } else if (pattern === 'diagonal') {
    tilesLayout = `
      <g transform="rotate(45, ${tileW / 2}, ${tileH / 2})">
        <rect width="${tileW}" height="${tileH}" fill="${baseColor}" />
        ${textureMarkup}
      </g>
    `;
  } else {
    // Standard Grid
    tilesLayout = `
      <rect width="${tileW}" height="${tileH}" fill="${baseColor}" />
      ${textureMarkup}
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${patternW}" height="${patternH}" viewBox="0 0 ${patternW} ${patternH}">
      <defs>
        <linearGradient id="stoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.15"/>
        </linearGradient>
      </defs>
      <!-- Grout background -->
      <rect width="${patternW}" height="${patternH}" fill="${groutColor}" />
      ${tilesLayout}
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

/**
 * Generates an architectural swatch background style.
 */
export function getTileBackgroundStyle(
  product?: Product,
  layoutPattern: LayoutPattern = 'grid',
  groutWidthMm = 2,
  groutColorHex = '#D8D0C3',
  orientationDeg = 0
): React.CSSProperties {
  if (!product) {
    return {
      backgroundColor: '#EAE6DF',
      backgroundImage: `radial-gradient(#D8D0C3 1px, transparent 1px)`,
      backgroundSize: '16px 16px',
    };
  }

  const svgDataUri = generateTilePatternSvg(product, {
    layoutPattern,
    groutWidthMm,
    groutColorHex,
  });

  return {
    backgroundImage: `url("${svgDataUri}")`,
    backgroundRepeat: 'repeat',
    transform: orientationDeg ? `rotate(${orientationDeg}deg)` : undefined,
  };
}
