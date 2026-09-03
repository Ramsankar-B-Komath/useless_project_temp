// SPRITES Mapping Object & High-Fidelity SVG Generators
// Supports both inline SVG strings and custom external image file paths

const SPRITES = {
  // Custom uploaded sprites
  moleNormal: 'assets/images/mole_normal.png',
  moleStunned: 'assets/images/mole_stunned.png',
  witherBoss: 'assets/images/wither.png',
  netherStar: 'assets/images/nether_star.png',
  glassBlock: 'assets/images/glass.png',
  obsidianBlock: 'assets/images/obsidian.png',
  beaconBlock: 'assets/images/beacon.png',
  gdCube: 'assets/images/gd_cube.png',
  gdShip: 'assets/images/gd_ship.png',
  gdSpike: 'assets/images/gd_spike.jpg',
  gdDoubleSpike: 'assets/images/gd_double_spike.png',
  gdPortal: 'assets/images/gd_portal.png',
  gdBg: 'assets/images/gd_bg.jpg',
  craftingTableGui: 'assets/images/crafting_table_gui.jpg',
  riasPfp: 'assets/images/rias_pfp.png',

  // Basketball (Vector SVG)
  basketball: `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ballShading" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#fb923c" />
        <stop offset="65%" stop-color="#ea580c" />
        <stop offset="100%" stop-color="#9a3412" />
      </radialGradient>
      <filter id="ballShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.35"/>
      </filter>
    </defs>
    <!-- Sphere -->
    <circle cx="50" cy="50" r="46" fill="url(#ballShading)" stroke="#7c2d12" stroke-width="2" filter="url(#ballShadow)"/>
    <!-- Seams / Ribs -->
    <line x1="4" y1="50" x2="96" y2="50" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="4" x2="50" y2="96" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
    <!-- Curved ribs -->
    <path d="M 16 16 C 42 32 42 68 16 84" fill="none" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
    <path d="M 84 16 C 58 32 58 68 84 84" fill="none" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
    <!-- Subtle specular highlight -->
    <ellipse cx="36" cy="24" rx="14" ry="7" transform="rotate(-30 36 24)" fill="#ffffff" opacity="0.3"/>
  </svg>`
};

/**
 * Universal Sprite Renderer
 * Cleanly renders inline SVGs or external image paths.
 */
function renderSprite(spriteKeyOrPath, className = 'w-10 h-10', alt = 'sprite') {
  let val = SPRITES[spriteKeyOrPath] || spriteKeyOrPath;

  if (typeof val === 'string' && val.trim().startsWith('<svg')) {
    return `<div class="${className} inline-flex items-center justify-center select-none pointer-events-none">${val}</div>`;
  }

  if (typeof val === 'string' && (
    val.startsWith('http') ||
    val.startsWith('/') ||
    val.startsWith('./') ||
    val.startsWith('assets/') ||
    val.startsWith('data:') ||
    /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(val)
  )) {
    return `<img src="${val}" alt="${alt}" class="${className} object-contain select-none pointer-events-none" />`;
  }

  return `<div class="${className} bg-zinc-700 rounded flex items-center justify-center text-xs text-white">${val}</div>`;
}

/**
 * Helper to convert SVG sprite or file into an Image object (used by 2D Canvas)
 */
function getSpriteImage(spriteKey, callback) {
  const val = SPRITES[spriteKey] || spriteKey;
  const img = new Image();

  img.onload = () => {
    if (callback) callback(img);
  };

  if (typeof val === 'string' && val.trim().startsWith('<svg')) {
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(val);
  } else if (typeof val === 'string') {
    img.src = val;
  }

  return img;
}

window.SPRITES = SPRITES;
window.renderSprite = renderSprite;
window.getSpriteImage = getSpriteImage;
