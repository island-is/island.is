import { theme } from '@island.is/island-ui/theme'

// Single source of truth for the editor's highlight palette. HighlightColorPicker
// renders these as swatches, and pasted backgrounds are snapped to the nearest
// of these colors below. The backend PDF renderer draws whatever hex value is
// stored, so every color here must be a 6-digit hex string.
export const HIGHLIGHT_COLORS = [
  { label: 'Yellow', color: theme.color.yellow400 },
  { label: 'Blue', color: theme.color.blue100 },
  { label: 'Mint', color: theme.color.mint200 },
  { label: 'Rose', color: theme.color.roseTinted200 },
  { label: 'Purple', color: theme.color.purple200 },
]

// Word's text highlighter supports exactly 15 colors — the classic CSS named
// palette minus white. A pasted highlight matching one of these is preserved
// as-is; any other color is snapped to the editor palette as a backup. Word's
// UI name is noted where it differs from the CSS keyword Word emits.
export const WORD_HIGHLIGHT_COLORS = [
  '#ffff00', // yellow
  '#00ff00', // lime — Bright Green
  '#00ffff', // cyan
  '#ff00ff', // magenta
  '#0000ff', // blue — Bright Blue
  '#ff0000', // red
  '#000080', // navy — Dark Blue
  '#008080', // teal
  '#008000', // green — Dark Green
  '#800080', // purple — Dark Violet
  '#800000', // maroon — Dark Red
  '#808000', // olive — Dark Yellow
  '#c0c0c0', // silver — Gray
  '#808080', // gray — Dark Gray
  '#000000', // black
]

// Word's text highlighter emits its palette as CSS color keywords (e.g.
// "background:yellow;mso-highlight:yellow"), so we resolve those here. The
// "dark"/"light" aliases are deliberately mapped onto the Word palette values
// rather than their slightly different CSS counterparts — in pasted content
// they can only mean the Word highlight. Keywords like "transparent", "white"
// or "windowtext" stay unresolvable and get stripped on paste.
const NAMED_COLORS: Record<string, [number, number, number]> = {
  yellow: [255, 255, 0],
  lime: [0, 255, 0],
  cyan: [0, 255, 255],
  aqua: [0, 255, 255],
  turquoise: [0, 255, 255],
  magenta: [255, 0, 255],
  fuchsia: [255, 0, 255],
  blue: [0, 0, 255],
  red: [255, 0, 0],
  navy: [0, 0, 128],
  darkblue: [0, 0, 128],
  teal: [0, 128, 128],
  darkcyan: [0, 128, 128],
  green: [0, 128, 0],
  darkgreen: [0, 128, 0],
  purple: [128, 0, 128],
  violet: [128, 0, 128],
  darkviolet: [128, 0, 128],
  maroon: [128, 0, 0],
  darkred: [128, 0, 0],
  olive: [128, 128, 0],
  darkyellow: [128, 128, 0],
  silver: [192, 192, 192],
  lightgray: [192, 192, 192],
  lightgrey: [192, 192, 192],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  darkgray: [128, 128, 128],
  darkgrey: [128, 128, 128],
  black: [0, 0, 0],
}

export const parseCssColor = (
  cssColor: string,
): [number, number, number] | null => {
  const named = NAMED_COLORS[cssColor.trim().toLowerCase()]
  if (named) return named
  const rgb = cssColor.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?/,
  )
  if (rgb) {
    // A fully transparent rgba value is not a visible highlight.
    if (rgb[4] !== undefined && parseFloat(rgb[4]) === 0) return null
    return [+rgb[1], +rgb[2], +rgb[3]]
  }
  const hex6 = cssColor.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (hex6)
    return [parseInt(hex6[1], 16), parseInt(hex6[2], 16), parseInt(hex6[3], 16)]
  const hex3 = cssColor.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i)
  if (hex3)
    return [
      parseInt(hex3[1] + hex3[1], 16),
      parseInt(hex3[2] + hex3[2], 16),
      parseInt(hex3[3] + hex3[3], 16),
    ]
  return null
}

const HIGHLIGHT_DISTANCE_THRESHOLD = 200

export const findNearestHighlightColor = (cssColor: string): string => {
  const fallback = HIGHLIGHT_COLORS[0].color
  const rgb = parseCssColor(cssColor)
  if (!rgb) return fallback

  let minDist = Infinity
  let nearest = fallback

  for (const { color } of HIGHLIGHT_COLORS) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const dist = Math.sqrt(
      (rgb[0] - r) ** 2 + (rgb[1] - g) ** 2 + (rgb[2] - b) ** 2,
    )
    if (dist < minDist) {
      minDist = dist
      nearest = color
    }
  }

  return minDist <= HIGHLIGHT_DISTANCE_THRESHOLD ? nearest : fallback
}

const rgbToHex = ([r, g, b]: [number, number, number]): string =>
  `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`

// An exact Word highlight color is preserved as its canonical hex; any other
// color falls back to snapping to the editor palette.
export const normalizeHighlightColor = (cssColor: string): string => {
  const rgb = parseCssColor(cssColor)
  if (rgb) {
    const hex = rgbToHex(rgb)
    if (WORD_HIGHLIGHT_COLORS.includes(hex)) return hex
  }
  return findNearestHighlightColor(cssColor)
}

// Normalize pasted backgrounds to a known highlight color, and strip ones we
// can't parse (e.g. Word's "transparent"), which would otherwise render as a
// black rectangle in the PDF. Word emits highlights as the "background"
// shorthand (retained via paste_retain_style_properties), which this rewrites
// to a background-color.
export const normalizePastedHighlights = (html: string): string =>
  html.replace(
    /background(-color)?:\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|[a-zA-Z]+)\s*;?/g,
    (_match: string, _shorthand: string, color: string) =>
      parseCssColor(color)
        ? `background-color: ${normalizeHighlightColor(color)};`
        : '',
  )

// Indent step (px) used by TinyMCE's indent/outdent buttons. Word paste uses
// margin-left in pt, which the buttons can't outdent, so we normalize it to
// padding-left rounded to this step (which the backend PDF also reads).
export const INDENT_STEP_PX = 40

export const normalizePastedIndentation = (html: string): string =>
  html.replace(
    /margin-left:\s*([\d.]+)(pt|px)\s*;?/g,
    (_match: string, value: string, unit: string) => {
      const numeric = parseFloat(value)
      const px = unit === 'pt' ? numeric * (96 / 72) : numeric
      const levels = Math.round(px / INDENT_STEP_PX)
      return levels > 0 ? `padding-left: ${levels * INDENT_STEP_PX}px;` : ''
    },
  )
