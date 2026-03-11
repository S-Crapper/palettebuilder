#!/usr/bin/env node
/**
 * Palette generator producing SCSS-style variables in the required format.
 * Usage:
 *   node palette.js --bg "#2d2d2d" --accent "#f79616" --green "#1dd169" --out palette.scss
 *   node palette.js --json config.json
 */

const fs = require('fs');
const { DEFAULTS, ORDER, generatePalette, formatPalette } = require('./palette-core');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const [key, val] = argv[i].split('=');
    if (key.startsWith('--')) {
      const k = key.replace(/^--/, '');
      if (val !== undefined) args[k] = val;
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) { args[k] = argv[i + 1]; i += 1; }
      else args[k] = true;
    }
  }
  return args;
}

function loadConfig(path) {
  const content = fs.readFileSync(path, 'utf8');
  return JSON.parse(content);
}

function main() {
  const args = parseArgs(process.argv);
  let config = {};
  if (args.json) config = loadConfig(args.json);
  if (args.bg) config.bg_color = args.bg;
  if (args.bg_color) config.bg_color = args.bg_color;
  ORDER.forEach((k) => {
    if (args[k]) config[k] = args[k];
  });

  const palette = generatePalette(config);
  const output = formatPalette(palette);
  if (args.out) {
    fs.writeFileSync(args.out, `${output}\n`, 'utf8');
  } else {
    process.stdout.write(`${output}\n`);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
