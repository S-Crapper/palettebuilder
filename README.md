# Palette Utility

Generate SCSS-style palette variables matching the provided naming and order.

## Usage
- Print to stdout (defaults to provided palette):
  `./palette.js`
- Override background color and write to file:
  `./palette.js --bg "#404040" --out palette.scss`
- Provide a JSON config:
  `./palette.js --json palette.json --out palette.scss`

`palette.json` keys (all optional):
```
{
  "bg_color": "#404040",
  "bright_green": "#1DD169",
  "darkish_green": "#19664c",
  "dark_orange": "#D68A0C",
  "darker_orange": "#D8690B",
  "z_yellow": "#F9CA1B",
  "bright_orange": "#F79616",
  "z_purple": "#9D3955",
  "matcha": "#2eb398",
  "prefader_send": "#D21E6D",
  "postfader_send": "#901ed2",
  "highlight_scale_bg": "#662266",
  "highlight_chord_bg": "#BB22BB",
  "highlight_both_bg": "#FF22FF",
  "highlight_scale_fg": "#F79616",
  "highlight_bass_fg": "white",
  "highlight_both_fg": "white"
}
```

Background variants auto-derive when `bg_color` is overridden; otherwise the exact palette provided in the request is emitted. All output lines always appear in the required order.

## GUI builder
- Open `palette-gui.html` in a browser (no build step needed). The page uses MUI via CDN plus the shared `palette-core.js`.
- Tweak colors with pickers or text fields; toggle “Auto-derive background variants” to regenerate the dark/light set from `bg_color`.
- Copy or download the export: it always contains every variable line in the exact order shown above.
