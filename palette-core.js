/**
 * Shared palette logic usable from both Node (CLI) and the browser (GUI).
 * UMD wrapper exposes `module.exports` in CommonJS and `window.PaletteCore` in browsers.
 */
(function buildUMD(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PaletteCore = factory();
  }
}(typeof self !== 'undefined' ? self : this, () => {
  const DEFAULTS = {
    bg_color: '#000000',
    bg_dark_variant1: '#000000',
    bg_dark_variant2: '#000000',
    bg_darker_variant1: '#000000',
    bg_darker_variant2: '#000000',
    bg_light_variant1: '#0D0D0D',
    bg_light_variant2: '#080808',
    bg_lighter_variant1: '#171717',
    bg_lighter_variant2: '#121212',
    dark_variant1: '#000000',
    dark_variant2: '#000000',
    light_variant1: '#404040',
    light_variant2: '#595959',
    bright_green: '#637E86',
    darkish_green: '#92ADB5',
    dark_orange: '#00D38D',
    darker_orange: '#00A36D',
    z_yellow: '#DB4B1F',
    bright_orange: '#D9633F',
    z_purple: '#B6258F',
    matcha: '#03C3D5',
    hover_color: 'gtkalpha(black, 0.05)',
    selection_color: 'gtkalpha(black, 0.05)',
    light_blueish: 'gtkalpha(#1aa3ff, 0.2)',
    prefader_send: '#3C6AB6',
    postfader_send: '#A557C1',
    highlight_scale_bg: '#648DCE',
    highlight_chord_bg: '#3C6AB6',
    highlight_both_bg: '#2A4C83',
    highlight_scale_fg: '#F19223',
    highlight_bass_fg: 'white',
    highlight_both_fg: 'white',
    text_color: 'rgb(255, 255, 255)',
    dim_fg: 'gtkalpha(currentColor, .55)',
    gray_100: '#1A1A1A',
    gray_200: '#2D2D2D',
    gray_300: '#404040',
    gray_400: '#595959',
    gray_500: '#808080',
    gray_600: '#A6A6A6',
    gray_700: '#CCCCCC',
    gray_800: '#E0E0E0',
    gray_900: '#F5F5F5',
    accent_red: '#E74C3C',
    accent_red_light: '#EC7063',
    accent_red_dark: '#C0392B',
    accent_blue: '#3498DB',
    accent_blue_light: '#5DADE2',
    accent_blue_dark: '#2874A6',
    accent_green: '#27AE60',
    accent_green_light: '#52BE80',
    accent_green_dark: '#1E8449',
    accent_cyan: '#16A085',
    accent_cyan_light: '#48C9B0',
    accent_cyan_dark: '#117A65',
    accent_pink: '#E84393',
    accent_pink_light: '#EC6BA9',
    accent_pink_dark: '#C71F7A',
    success_color: '#27AE60',
    warning_color: '#F39C12',
    error_color: '#E74C3C',
    info_color: '#3498DB',
    success_bg: 'gtkalpha($success_color, 0.15)',
    warning_bg: 'gtkalpha($warning_color, 0.15)',
    error_bg: 'gtkalpha($error_color, 0.15)',
    info_bg: 'gtkalpha($info_color, 0.15)',
    border_color: '$gray_300',
    border_color_light: '$gray_200',
    border_color_dark: '$gray_400',
    divider_color: 'gtkalpha($gray_400, 0.3)',
    radius_none: '0',
    radius_sm: '2px',
    radius_md: '4px',
    radius_lg: '6px',
    radius_xl: '8px',
    radius_xxl: '12px',
    radius_full: '50%',
  };

  const ORDER = [
    'bg_color', 'bg_dark_variant1', 'bg_dark_variant2', 'bg_darker_variant1', 'bg_darker_variant2',
    'bg_light_variant1', 'bg_light_variant2', 'bg_lighter_variant1', 'bg_lighter_variant2',
    'dark_variant1', 'dark_variant2', 'light_variant1', 'light_variant2',
    'bright_green', 'darkish_green', 'dark_orange', 'darker_orange', 'z_yellow', 'bright_orange', 'z_purple', 'matcha',
    'hover_color', 'selection_color', 'light_blueish',
    'prefader_send', 'postfader_send',
    'highlight_scale_bg', 'highlight_chord_bg', 'highlight_both_bg',
    'highlight_scale_fg', 'highlight_bass_fg', 'highlight_both_fg',
    'text_color', 'dim_fg',
    'gray_100', 'gray_200', 'gray_300', 'gray_400', 'gray_500', 'gray_600', 'gray_700', 'gray_800', 'gray_900',
    'accent_red', 'accent_red_light', 'accent_red_dark',
    'accent_blue', 'accent_blue_light', 'accent_blue_dark',
    'accent_green', 'accent_green_light', 'accent_green_dark',
    'accent_cyan', 'accent_cyan_light', 'accent_cyan_dark',
    'accent_pink', 'accent_pink_light', 'accent_pink_dark',
    'success_color', 'warning_color', 'error_color', 'info_color',
    'success_bg', 'warning_bg', 'error_bg', 'info_bg',
    'border_color', 'border_color_light', 'border_color_dark', 'divider_color',
    'radius_none', 'radius_sm', 'radius_md', 'radius_lg', 'radius_xl', 'radius_xxl', 'radius_full',
  ];

  const BACKGROUND_KEYS = ORDER.slice(0, 13);

  function clamp01(x) {
    return Math.min(1, Math.max(0, x));
  }

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) throw new Error(`Invalid hex: ${hex}`);
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }

  function rgbToHex({ r, g, b }) {
    const toHex = (v) => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  function rgbToHsl({ r, g, b }) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b); const min = Math.min(r, g, b);
    let h; let s; const l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h, s, l };
  }

  function hslToRgb({ h, s, l }) {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    let r; let g; let b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  function shiftLightness(hex, delta) {
    const hsl = rgbToHsl(hexToRgb(hex));
    const shifted = { ...hsl, l: clamp01(hsl.l + delta) };
    return rgbToHex(hslToRgb(shifted));
  }

  function buildBackgroundVariants(bg) {
    return {
      bg_color: bg,
      bg_dark_variant1: shiftLightness(bg, -0.06),
      bg_dark_variant2: shiftLightness(bg, -0.12),
      bg_darker_variant1: shiftLightness(bg, -0.14),
      bg_darker_variant2: shiftLightness(bg, -0.24),
      bg_light_variant1: shiftLightness(bg, 0.05),
      bg_light_variant2: shiftLightness(bg, 0.03),
      bg_lighter_variant1: shiftLightness(bg, 0.09),
      bg_lighter_variant2: shiftLightness(bg, 0.07),
      dark_variant1: shiftLightness(bg, -0.4),
      dark_variant2: shiftLightness(bg, -0.36),
      light_variant1: shiftLightness(bg, 0.25),
      light_variant2: shiftLightness(bg, 0.35),
    };
  }

  function generatePalette(config = {}) {
    const bg = config.bg_color || config.bg || DEFAULTS.bg_color;
    const hasBgOverride = Object.prototype.hasOwnProperty.call(config, 'bg_color')
      || Object.prototype.hasOwnProperty.call(config, 'bg');
    const baseBackgrounds = hasBgOverride ? buildBackgroundVariants(bg)
      : BACKGROUND_KEYS.reduce((acc, key) => ({ ...acc, [key]: DEFAULTS[key] }), {});

    const rest = ORDER
      .filter((key) => !BACKGROUND_KEYS.includes(key))
      .reduce((acc, key) => ({ ...acc, [key]: config[key] || DEFAULTS[key] }), {});

    return { ...baseBackgrounds, ...rest };
  }

  function formatPalette(palette) {
    return ORDER.map((key) => `$${key}: ${palette[key]};`).join('\n');
  }

  return {
    DEFAULTS,
    ORDER,
    clamp01,
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    hslToRgb,
    shiftLightness,
    buildBackgroundVariants,
    generatePalette,
    formatPalette,
  };
}));
