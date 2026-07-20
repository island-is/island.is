// The editor's highlight palette: exactly the 15 colors of Word's text
// highlighter — the classic CSS named palette minus white. HighlightColorPicker
// renders these as swatches, pasted backgrounds are snapped onto them (exact
// Word colors survive unchanged), and the backend PDF renderer draws whatever
// hex value the class encodes, so every color here must be a 6-digit hex
// string. Labels are Word's UI names; the comments note the CSS keyword Word
// emits.
export const WORD_HIGHLIGHT_COLORS = [
  { label: 'Yellow', color: '#ffff00' }, // yellow
  { label: 'Bright Green', color: '#00ff00' }, // lime
  { label: 'Cyan', color: '#00ffff' }, // cyan
  { label: 'Magenta', color: '#ff00ff' }, // magenta
  { label: 'Bright Blue', color: '#0000ff' }, // blue
  { label: 'Red', color: '#ff0000' }, // red
  { label: 'Dark Blue', color: '#000080' }, // navy
  { label: 'Teal', color: '#008080' }, // teal
  { label: 'Dark Green', color: '#008000' }, // green
  { label: 'Dark Violet', color: '#800080' }, // purple
  { label: 'Dark Red', color: '#800000' }, // maroon
  { label: 'Dark Yellow', color: '#808000' }, // olive
  { label: 'Gray', color: '#c0c0c0' }, // silver
  { label: 'Dark Gray', color: '#808080' }, // gray
  { label: 'Black', color: '#000000' }, // black
]

// Formatting is stored as classes (hl-ffff00, indent-2) rather than inline
// styles: the WAF in front of the API blocks any request body containing a
// style="..." attribute as a suspected XSS payload, so no inline style may
// ever appear in content sent to the server. The editor's content CSS and the
// backend PDF renderer both resolve these classes.
export const highlightClassFromColor = (color: string): string =>
  `hl-${color.slice(1).toLowerCase()}`

const HIGHLIGHT_CLASS_REGEX = /^hl-([0-9a-f]{6})$/

export const colorFromHighlightClass = (className: string): string | null => {
  const match = className.match(HIGHLIGHT_CLASS_REGEX)
  return match ? `#${match[1]}` : null
}

// Indent step (px) rendered per indent-N level in the editor. The backend PDF
// renderer indents 30pt (40px * 0.75) per level to match.
export const INDENT_STEP_PX = 40
export const MAX_INDENT_LEVEL = 10

export const indentClassFromLevel = (level: number): string => `indent-${level}`

const INDENT_CLASS_REGEX = /^indent-(\d+)$/

export const levelFromIndentClass = (className: string): number | null => {
  const match = className.match(INDENT_CLASS_REGEX)
  return match ? Math.min(MAX_INDENT_LEVEL, parseInt(match[1], 10)) : null
}

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

// Snap a CSS color onto the palette: exact palette colors (e.g. re-pasted
// editor content) map to themselves, anything else goes to the nearest
// palette color, and colors we cannot resolve fall back to yellow.
export const findNearestHighlightColor = (cssColor: string): string => {
  const fallback = WORD_HIGHLIGHT_COLORS[0].color
  const rgb = parseCssColor(cssColor)
  if (!rgb) return fallback

  let minDist = Infinity
  let nearest = fallback

  for (const { color } of WORD_HIGHLIGHT_COLORS) {
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

const BACKGROUND_REGEX = /background(?:-color)?\s*:\s*([^;]+)/i
const LEFT_OFFSET_REGEX = /(?:margin|padding)-left\s*:\s*([\d.]+)(pt|px)/i
const BOLD_REGEX = /font-weight\s*:\s*(?:bold|bolder|[6-9]00)/i
const ITALIC_REGEX = /font-style\s*:\s*(?:italic|oblique)/i

const BLOCK_TAGS = new Set(['P', 'DIV', 'LI', 'BLOCKQUOTE'])

// Wrap an element's children (e.g. in strong/em) so inline-style bold/italic
// survives as semantic markup once the style attribute is dropped.
const wrapChildren = (doc: Document, el: Element, tagName: string) => {
  const wrapper = doc.createElement(tagName)
  while (el.firstChild) {
    wrapper.appendChild(el.firstChild)
  }
  el.appendChild(wrapper)
}

// Rewrite HTML so no style="..." attribute survives — the WAF in front of the
// API blocks request bodies containing one. Backgrounds (Word emits highlights
// as the "background" shorthand, retained via paste_retain_style_properties;
// the paste plugin also maps mso-highlight onto it) are snapped onto the
// palette as hl-xxxxxx classes, and unresolvable ones (e.g. Word's
// "transparent") are stripped so they don't render as black rectangles in the
// PDF. Left margins/paddings on blocks (Word indents in pt) become indent-N
// classes rounded to the indent step. Inline bold/italic become strong/em.
// Everything else in the style attribute is dropped. Besides paste, this also
// migrates legacy saved content — which stored highlights and indentation as
// inline styles — when it is loaded into the editor.
export const normalizeRichTextHtml = (html: string): string => {
  // SSR guard: normalization only matters in the browser, where the editor
  // runs — on the server just pass the content through.
  if (typeof DOMParser === 'undefined' || !html) return html

  const doc = new DOMParser().parseFromString(html, 'text/html')

  for (const el of Array.from(doc.body.querySelectorAll('[style]'))) {
    const style = el.getAttribute('style') ?? ''
    el.removeAttribute('style')

    const background = style.match(BACKGROUND_REGEX)
    if (background && parseCssColor(background[1].trim())) {
      el.classList.add(
        highlightClassFromColor(
          findNearestHighlightColor(background[1].trim()),
        ),
      )
    }

    const leftOffset = style.match(LEFT_OFFSET_REGEX)
    if (leftOffset && BLOCK_TAGS.has(el.tagName)) {
      const numeric = parseFloat(leftOffset[1])
      const px = leftOffset[2] === 'pt' ? numeric * (96 / 72) : numeric
      const level = Math.min(MAX_INDENT_LEVEL, Math.round(px / INDENT_STEP_PX))
      if (level > 0) {
        el.classList.add(indentClassFromLevel(level))
      }
    }

    // When an element carries both, strong ends up nested inside em —
    // either nesting renders the same.
    if (BOLD_REGEX.test(style)) {
      wrapChildren(doc, el, 'strong')
    }
    if (ITALIC_REGEX.test(style)) {
      wrapChildren(doc, el, 'em')
    }

    // A span that carried nothing but now-dropped styles is just noise.
    if (el.tagName === 'SPAN' && el.attributes.length === 0) {
      el.replaceWith(...Array.from(el.childNodes))
    }
  }

  return doc.body.innerHTML
}
