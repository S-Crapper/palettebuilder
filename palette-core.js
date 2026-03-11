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
    bg_color: '#2D2D2D',
    bg_dark_variant1: '#262626',
    bg_dark_variant2: '#1F1F1F',
    bg_darker_variant1: '#202020',
    bg_darker_variant2: '#121212',
    bg_light_variant1: '#3A3A3A',
    bg_light_variant2: '#343434',
    bg_lighter_variant1: '#444444',
    bg_lighter_variant2: '#393939',
    dark_variant1: '#000000',
    dark_variant2: '#030202',
    light_variant1: '#656464',
    light_variant2: '#989797',
    bright_green: '#1DD169',
    darkish_green: '#19664c',
    dark_orange: '#D68A0C',
    darker_orange: '#D8690B',
    z_yellow: '#F9CA1B',
    bright_orange: '#F79616',
    z_purple: '#9D3955',
    matcha: '#2eb398',
    hover_color: 'gtkalpha(white, 0.1)',
    selection_color: 'gtkalpha(white, 0.07)',
    light_blueish: 'gtkalpha(#1aa3ff, 0.8)',
    prefader_send: '#D21E6D',
    postfader_send: '#901ed2',
    highlight_scale_bg: '#662266',
    highlight_chord_bg: '#BB22BB',
    highlight_both_bg: '#FF22FF',
    highlight_scale_fg: '#F79616',
    highlight_bass_fg: 'white',
    highlight_both_fg: 'white',
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
  ];

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
    const bgSet = hasBgOverride ? buildBackgroundVariants(bg) : {
      bg_color: DEFAULTS.bg_color,
      bg_dark_variant1: DEFAULTS.bg_dark_variant1,
      bg_dark_variant2: DEFAULTS.bg_dark_variant2,
      bg_darker_variant1: DEFAULTS.bg_darker_variant1,
      bg_darker_variant2: DEFAULTS.bg_darker_variant2,
      bg_light_variant1: DEFAULTS.bg_light_variant1,
      bg_light_variant2: DEFAULTS.bg_light_variant2,
      bg_lighter_variant1: DEFAULTS.bg_lighter_variant1,
      bg_lighter_variant2: DEFAULTS.bg_lighter_variant2,
      dark_variant1: DEFAULTS.dark_variant1,
      dark_variant2: DEFAULTS.dark_variant2,
      light_variant1: DEFAULTS.light_variant1,
      light_variant2: DEFAULTS.light_variant2,
    };
    const fixed = {
      bright_green: config.bright_green || DEFAULTS.bright_green,
      darkish_green: config.darkish_green || DEFAULTS.darkish_green,
      dark_orange: config.dark_orange || DEFAULTS.dark_orange,
      darker_orange: config.darker_orange || DEFAULTS.darker_orange,
      z_yellow: config.z_yellow || DEFAULTS.z_yellow,
      bright_orange: config.bright_orange || DEFAULTS.bright_orange,
      z_purple: config.z_purple || DEFAULTS.z_purple,
      matcha: config.matcha || DEFAULTS.matcha,
      hover_color: config.hover_color || DEFAULTS.hover_color,
      selection_color: config.selection_color || DEFAULTS.selection_color,
      light_blueish: config.light_blueish || DEFAULTS.light_blueish,
      prefader_send: config.prefader_send || DEFAULTS.prefader_send,
      postfader_send: config.postfader_send || DEFAULTS.postfader_send,
      highlight_scale_bg: config.highlight_scale_bg || DEFAULTS.highlight_scale_bg,
      highlight_chord_bg: config.highlight_chord_bg || DEFAULTS.highlight_chord_bg,
      highlight_both_bg: config.highlight_both_bg || DEFAULTS.highlight_both_bg,
      highlight_scale_fg: config.highlight_scale_fg || DEFAULTS.highlight_scale_fg,
      highlight_bass_fg: config.highlight_bass_fg || DEFAULTS.highlight_bass_fg,
      highlight_both_fg: config.highlight_both_fg || DEFAULTS.highlight_both_fg,
    };
    return { ...bgSet, ...fixed };
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
