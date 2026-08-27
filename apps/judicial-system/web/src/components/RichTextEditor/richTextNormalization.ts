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

// The lists plugin suppresses the marker on the wrapper items it creates — when
// an item is indented past the nesting available to it — with an inline
// list-style-type. That must not reach the API either, so it is carried as a
// class like highlights and indentation are.
export const MARKER_NONE_CLASS = 'marker-none'

const MARKER_NONE_REGEX = /list-style-type\s*:\s*none/i
const BACKGROUND_REGEX = /background(?:-color)?\s*:\s*([^;]+)/i
const LEFT_OFFSET_REGEX = /(?:margin|padding)-left\s*:\s*([\d.]+)(pt|px)/i
// Word's AutoFormat turns a Tab at the start of a paragraph into a first-line
// indent, which reaches the clipboard as text-indent (in pt) — indenting a
// multi-paragraph selection uses margin-left instead. It can be negative
// (hanging indents), so the sign is captured and the offsets are summed.
const TEXT_INDENT_REGEX = /text-indent\s*:\s*(-?[\d.]+)(pt|px)/i
const BOLD_REGEX = /font-weight\s*:\s*(?:bold|bolder|[6-9]00)/i
const ITALIC_REGEX = /font-style\s*:\s*(?:italic|oblique)/i

const offsetToPx = (offset: RegExpMatchArray): number => {
  const numeric = parseFloat(offset[1])
  return offset[2].toLowerCase() === 'pt' ? numeric * (96 / 72) : numeric
}

// LI is deliberately absent: a list item's level is expressed by how deeply it
// is nested, and Word indents its items with margin-left on top of that. Turning
// that margin into an indent class would double the indentation — and because
// the class pads the item itself, it would push the text away from its own
// bullet or number rather than moving the whole item.
const BLOCK_TAGS = new Set(['P', 'DIV', 'BLOCKQUOTE'])

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
// as the "background" shorthand) are snapped onto the palette as hl-xxxxxx
// classes, and unresolvable ones (e.g. Word's "transparent") are stripped so
// they don't render as black rectangles in the PDF. Left margins/paddings on
// blocks (Word indents in pt) become indent-N classes rounded to the indent
// step. Inline bold/italic become strong/em. Everything else in the style
// attribute is dropped. This is what migrates legacy saved content — which
// stored highlights and indentation as inline styles — when it is loaded into
// the editor: the Tiptap schema would silently drop those styles rather than
// convert them, so this must run before content reaches the editor.
export const normalizeRichTextHtml = (html: string): string => {
  // SSR guard: normalization only matters in the browser, where the editor
  // runs — on the server just pass the content through.
  if (typeof DOMParser === 'undefined' || !html) return html

  const doc = new DOMParser().parseFromString(html, 'text/html')
  normalizeTables(doc)
  normalizeDoc(doc)

  // Markup without visible text (e.g. '<p>&nbsp;&nbsp;</p>' from typing only
  // spaces - the editor stores consecutive spaces as non-breaking spaces) is
  // effectively empty. Emit '' so required-field validation and persistence
  // treat it like any other blank input. textContent decodes the entities and
  // trim() removes the resulting non-breaking spaces. A table is content even
  // before anything is typed into it — a just-inserted empty table must not
  // be wiped on the next save/load round-trip.
  if (!hasVisibleDocContent(doc)) {
    return ''
  }

  return doc.body.innerHTML
}

const hasVisibleDocContent = (doc: Document): boolean =>
  Boolean(doc.body.textContent?.trim()) ||
  doc.body.querySelector('table') !== null

// Whether saved editor HTML holds anything a user would consider content: text
// or an (even empty) table. Consumers use this instead of a plain-text check
// when deciding to persist or wipe a value.
export const hasVisibleContent = (html: string): boolean => {
  if (!html) return false
  if (typeof DOMParser === 'undefined') return true
  return hasVisibleDocContent(
    new DOMParser().parseFromString(html, 'text/html'),
  )
}

// Tags whose background style is table chrome (Word shades cells with
// background:#d9d9d9), not a text highlight — converting it to an hl- class
// would color the cell's text.
const TABLE_CHROME_TAGS = new Set([
  'TABLE',
  'THEAD',
  'TBODY',
  'TFOOT',
  'TR',
  'TD',
  'TH',
])

// Block-level elements a table cell can hold; whitespace-only text next to
// one of these is layout, not content.
const CELL_BLOCK_TAGS = new Set(['P', 'DIV', 'BLOCKQUOTE', 'UL', 'OL', 'TABLE'])

// Attributes Word/Docs put on table markup that the schema would drop anyway;
// scrubbed here so the pipeline's own output stays clean and testable.
const TABLE_PRESENTATION_ATTRIBUTES = [
  'align',
  'bgcolor',
  'border',
  'cellpadding',
  'cellspacing',
  'height',
  'valign',
  'width',
]

// Reduce every pasted or loaded table to the minimal shape the schema can
// hold: no nested tables, no headers, no merged cells, no colgroup — the same
// contract the editor itself serializes and the PDF renderer lays out.
const normalizeTables = (doc: Document) => {
  // Nested tables cannot live inside a cell, and the schema parser would
  // hoist them out behind their host table — unwrap them into their host
  // cell instead, innermost first so each replacement leaves no nesting
  // behind it.
  for (const inner of Array.from(
    doc.body.querySelectorAll('table table'),
  ).reverse()) {
    const blocks: Element[] = []
    for (const cell of Array.from(inner.querySelectorAll('td, th'))) {
      if (cell.children.length > 0) {
        blocks.push(...Array.from(cell.children))
      } else if (cell.textContent?.trim()) {
        // A cell holding bare text keeps it via a paragraph wrapper.
        const p = doc.createElement('p')
        p.textContent = cell.textContent ?? ''
        blocks.push(p)
      }
    }
    inner.replaceWith(...blocks)
  }

  for (const table of Array.from(doc.body.querySelectorAll('table'))) {
    // A caption is real text; keep it as a paragraph before the table.
    for (const caption of Array.from(table.querySelectorAll('caption'))) {
      const p = doc.createElement('p')
      p.textContent = caption.textContent ?? ''
      table.before(p)
      caption.remove()
    }
    for (const el of Array.from(table.querySelectorAll('colgroup, col'))) {
      el.remove()
    }
    for (const th of Array.from(table.querySelectorAll('th'))) {
      const td = doc.createElement('td')
      for (const attribute of Array.from(th.attributes)) {
        td.setAttribute(attribute.name, attribute.value)
      }
      while (th.firstChild) {
        td.appendChild(th.firstChild)
      }
      th.replaceWith(td)
    }

    flattenMergedCells(table)

    for (const el of [table, ...Array.from(table.querySelectorAll('*'))]) {
      for (const attribute of TABLE_PRESENTATION_ATTRIBUTES) {
        el.removeAttribute(attribute)
      }

      // Word separates table markup with literal newlines; whitespace-only
      // text between structural elements (and around the block elements
      // inside a cell) is not content — the same cleanup the paste pipeline
      // does between body-level blocks. Whitespace between a cell's inline
      // children ("<strong>a</strong> <em>b</em>") is content and stays.
      const structural = ['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR'].includes(
        el.tagName,
      )
      if (structural || el.tagName === 'TD') {
        for (const node of Array.from(el.childNodes)) {
          if (node.nodeType !== Node.TEXT_NODE || node.textContent?.trim()) {
            continue
          }
          const touchesBlock = [node.previousSibling, node.nextSibling].some(
            (sibling) =>
              sibling !== null &&
              sibling.nodeType === Node.ELEMENT_NODE &&
              CELL_BLOCK_TAGS.has((sibling as Element).tagName),
          )
          if (structural || touchesBlock) {
            node.remove()
          }
        }
      }
    }
  }
}

// Expand colspan/rowspan merges into a rectangular grid of plain cells.
// Dropping the attributes alone would shift every later cell out of its
// column; instead each merged cell keeps its top-left position and the
// covered positions become empty cells.
const flattenMergedCells = (table: Element) => {
  const doc = table.ownerDocument
  // How many upcoming rows each column position is still covered by a
  // rowspan from above.
  const pendingRowspans: number[] = []

  for (const row of Array.from(table.querySelectorAll('tr'))) {
    let column = 0

    for (const cell of Array.from(row.children)) {
      if (cell.tagName !== 'TD') continue

      // Positions covered by a rowspan from above get an empty cell so this
      // row's own cells stay in their columns.
      while ((pendingRowspans[column] ?? 0) > 0) {
        pendingRowspans[column] -= 1
        row.insertBefore(doc.createElement('td'), cell)
        column += 1
      }

      const colspan = Math.max(
        1,
        parseInt(cell.getAttribute('colspan') ?? '1', 10) || 1,
      )
      const rowspan = Math.max(
        1,
        parseInt(cell.getAttribute('rowspan') ?? '1', 10) || 1,
      )
      cell.removeAttribute('colspan')
      cell.removeAttribute('rowspan')

      for (let i = 0; i < colspan; i++) {
        pendingRowspans[column + i] =
          (pendingRowspans[column + i] ?? 0) + (rowspan - 1)
      }
      for (let i = 1; i < colspan; i++) {
        row.insertBefore(doc.createElement('td'), cell.nextSibling)
      }
      column += colspan
    }

    // Trailing positions covered from above: pad up to the last covered
    // column so every pending position keeps its alignment.
    let lastPending = pendingRowspans.length - 1
    while (lastPending >= column && (pendingRowspans[lastPending] ?? 0) === 0) {
      lastPending -= 1
    }
    while (column <= lastPending) {
      if ((pendingRowspans[column] ?? 0) > 0) {
        pendingRowspans[column] -= 1
      }
      row.appendChild(doc.createElement('td'))
      column += 1
    }
  }
}

const normalizeDoc = (doc: Document) => {
  for (const el of Array.from(doc.body.querySelectorAll('[style]'))) {
    const style = el.getAttribute('style') ?? ''
    el.removeAttribute('style')

    const background = style.match(BACKGROUND_REGEX)
    if (
      background &&
      parseCssColor(background[1].trim()) &&
      !TABLE_CHROME_TAGS.has(el.tagName)
    ) {
      el.classList.add(
        highlightClassFromColor(
          findNearestHighlightColor(background[1].trim()),
        ),
      )
    }

    if (el.tagName === 'LI' && MARKER_NONE_REGEX.test(style)) {
      el.classList.add(MARKER_NONE_CLASS)
    }

    // Word paragraphs are one line each, so a first-line indent (text-indent)
    // is visually a block indent and both offsets add up.
    const leftOffset = style.match(LEFT_OFFSET_REGEX)
    const textIndent = style.match(TEXT_INDENT_REGEX)
    if ((leftOffset || textIndent) && BLOCK_TAGS.has(el.tagName)) {
      const px =
        (leftOffset ? offsetToPx(leftOffset) : 0) +
        (textIndent ? offsetToPx(textIndent) : 0)
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

  // Migrate content saved while list items still received indent classes. The
  // loop above only visits elements that carry a style attribute, so an item
  // whose class was already written out has to be cleaned up separately.
  for (const item of Array.from(doc.body.querySelectorAll('li[class]'))) {
    for (const className of Array.from(item.classList)) {
      if (levelFromIndentClass(className) !== null) {
        item.classList.remove(className)
      }
    }
    if (item.classList.length === 0) {
      item.removeAttribute('class')
    }
  }
}

// --- External-paste pipeline -----------------------------------------------
//
// The editor does no Word filtering of its own, so the raw clipboard HTML
// arrives here: Word artifacts are removed, Word's fake lists (styled
// paragraphs) become real ul/ol/li, and the result goes through the same
// style-to-class normalization as loaded content. Element/attribute
// whitelisting is NOT done here — the editor schema can only represent the
// vocabulary we define, so everything else is dropped at parse time.

const NON_CONTENT_TAGS = 'style, script, meta, link, title, head, xml'

// Strip what Word puts on the clipboard that can never be content: conditional
// comments (<!--[if !supportLists]-->…), style/script/meta blocks, and
// namespaced elements (o:p, w:sdt, v:shape …), which are unwrapped so any real
// text inside them survives.
const removeWordArtifacts = (doc: Document) => {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_COMMENT)
  const comments: Node[] = []
  while (walker.nextNode()) {
    comments.push(walker.currentNode)
  }
  for (const comment of comments) {
    comment.parentNode?.removeChild(comment)
  }

  for (const el of Array.from(doc.body.querySelectorAll(NON_CONTENT_TAGS))) {
    el.remove()
  }

  for (const el of Array.from(doc.body.querySelectorAll('*'))) {
    if (el.tagName.includes(':')) {
      el.replaceWith(...Array.from(el.childNodes))
    }
  }
}

// Word does not put real lists on the clipboard. Each item is a <p> styled
// with "mso-list:l<id> level<n>" whose visible marker ("1.", "·") sits in a
// span styled "mso-list:Ignore". The id groups paragraphs into one list, the
// level gives the nesting depth.
const MSO_LIST_ITEM_REGEX = /mso-list\s*:\s*l(\d+)\s+level(\d+)/i
const MSO_LIST_IGNORE_REGEX = /mso-list\s*:\s*ignore/i

// Word Online and paste-merge-formatting drop the mso-list style but keep the
// paragraph class and a literal marker at the start of the text.
const WORD_LIST_CLASS_REGEX = /(?:^|\s)(?:Mso)?ListParagraph/i

// A marker is ordered when it is a number, letters, or roman numerals with
// closing punctuation ("1.", "a)", "(iv)", "[B]"). Bare bullet glyphs — Word
// uses · (Symbol font), o (Courier New), § and ▪ (Wingdings) — have no
// punctuation and fall through to unordered.
const ORDERED_MARKER_REGEX = /^\(?(?:\d{1,4}|[a-zA-Z]{1,3}|[ivxlcdmIVXLCDM]{1,7})[.)\]]$/

// The literal marker at the start of an item's text when no mso-list:Ignore
// span identifies it: a bullet glyph or an ordered marker, followed by
// whitespace (Word pads with no-break spaces).
const LEADING_MARKER_REGEX = /^[\s\u00a0]*((?:[·•o§▪*]|-|–|—)|\(?(?:\d{1,4}|[a-zA-Z]{1,3})[.)\]])[\s\u00a0]+/

// Word's default list indentation is 36pt (48px) per level, so the fallback
// derives the level from the paragraph's left margin.
const WORD_LIST_LEVEL_STEP_PX = 48

type WordListItem = { listId: string; level: number }

const detectWordListItem = (el: Element): WordListItem | null => {
  if (el.tagName !== 'P') return null
  const style = el.getAttribute('style') ?? ''

  const msoList = style.match(MSO_LIST_ITEM_REGEX)
  if (msoList) {
    return { listId: msoList[1], level: Math.max(1, parseInt(msoList[2], 10)) }
  }

  if (
    WORD_LIST_CLASS_REGEX.test(el.getAttribute('class') ?? '') &&
    LEADING_MARKER_REGEX.test(el.textContent ?? '')
  ) {
    const leftOffset = style.match(LEFT_OFFSET_REGEX)
    const level = leftOffset
      ? Math.max(
          1,
          Math.round(offsetToPx(leftOffset) / WORD_LIST_LEVEL_STEP_PX),
        )
      : 1
    // Consecutive fallback items share one synthetic list id, so a plain
    // paragraph between them (which resets the conversion) splits the lists.
    return { listId: 'word-online', level }
  }

  return null
}

// Remove the item's marker and return its text, so the list type can be
// derived from it. The marker lives in a span styled mso-list:Ignore (the 7pt
// spacer span Word adds is nested inside it and goes too); without one, the
// literal marker is stripped from the leading text.
const extractMarker = (item: Element): string => {
  for (const span of Array.from(item.querySelectorAll('span'))) {
    if (
      span.isConnected &&
      MSO_LIST_IGNORE_REGEX.test(span.getAttribute('style') ?? '')
    ) {
      const marker = (span.textContent ?? '')
        .replace(/[\s\u00a0]+/g, ' ')
        .trim()
      span.remove()
      return marker
    }
  }

  const walker = item.ownerDocument.createTreeWalker(item, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const textNode = walker.currentNode
    const text = textNode.textContent ?? ''
    if (!text.trim()) continue
    const match = text.match(LEADING_MARKER_REGEX)
    if (match) {
      textNode.textContent = text.slice(match[0].length)
      return match[1]
    }
    return ''
  }
  return ''
}

// Rebuild Word's fake lists into real ul/ol/li. One pass over the body's
// children with a stack of open lists: a non-item paragraph closes everything,
// a different list id closes everything, a shallower item pops back to its
// level, and a deeper item nests — through marker-none wrapper items when
// levels are skipped (1 → 3), the same model the PDF renderer already
// understands. The first item seen at a given (id, level) fixes whether that
// list is ordered or unordered.
const convertWordFakeLists = (doc: Document) => {
  const typeByIdAndLevel = new Map<string, string>()
  let stack: { list: Element; level: number }[] = []
  let currentListId: string | null = null

  for (const el of Array.from(doc.body.children)) {
    const item = detectWordListItem(el)
    if (!item) {
      stack = []
      currentListId = null
      continue
    }

    const marker = extractMarker(el)
    const typeKey = `${item.listId}:${item.level}`
    let tag = typeByIdAndLevel.get(typeKey)
    if (!tag) {
      tag = ORDERED_MARKER_REGEX.test(marker) ? 'ol' : 'ul'
      typeByIdAndLevel.set(typeKey, tag)
    }

    if (item.listId !== currentListId) {
      stack = []
      currentListId = item.listId
    }

    while (stack.length > 0 && stack[stack.length - 1].level > item.level) {
      stack.pop()
    }
    // A type change at the same level ends that list and starts a sibling of
    // the right type.
    const top = stack[stack.length - 1]
    if (
      top &&
      top.level === item.level &&
      top.list.tagName.toLowerCase() !== tag
    ) {
      stack.pop()
    }

    if (stack.length === 0) {
      const list = doc.createElement(
        item.level === 1
          ? tag
          : typeByIdAndLevel.get(`${item.listId}:1`) ?? 'ul',
      )
      el.before(list)
      stack.push({ list, level: 1 })
    }

    // Nest down to the item's level. Deeper lists hang off the previous item,
    // or off a fresh marker-none wrapper when a level has no items of its own.
    while (stack[stack.length - 1].level < item.level) {
      const parent = stack[stack.length - 1]
      let host = parent.list.lastElementChild
      if (!host) {
        host = doc.createElement('li')
        host.className = MARKER_NONE_CLASS
        parent.list.appendChild(host)
      }
      const childLevel = parent.level + 1
      const childList = doc.createElement(
        childLevel === item.level
          ? tag
          : typeByIdAndLevel.get(`${item.listId}:${childLevel}`) ?? 'ul',
      )
      host.appendChild(childList)
      stack.push({ list: childList, level: childLevel })
    }

    const li = doc.createElement('li')
    while (el.firstChild) {
      li.appendChild(el.firstChild)
    }
    // Whitespace that padded the removed marker must not lead the item text.
    const firstText = li.firstChild
    if (firstText?.nodeType === Node.TEXT_NODE) {
      firstText.textContent = (firstText.textContent ?? '').replace(
        /^[\s\u00a0]+/,
        '',
      )
    }
    stack[stack.length - 1].list.appendChild(li)
    el.remove()
  }
}

// The editor schema drops unrecognized classes at parse time anyway; scrubbing
// them here as well keeps the pipeline's own output clean (Word litters
// MsoNormal/MsoListParagraph everywhere) and testable as a pure function.
const isKnownClass = (className: string): boolean =>
  colorFromHighlightClass(className) !== null ||
  levelFromIndentClass(className) !== null ||
  className === MARKER_NONE_CLASS

const removeUnknownClasses = (doc: Document) => {
  for (const el of Array.from(doc.body.querySelectorAll('[class]'))) {
    for (const className of Array.from(el.classList)) {
      if (!isKnownClass(className)) {
        el.classList.remove(className)
      }
    }
    if (el.classList.length === 0) {
      el.removeAttribute('class')
    }
  }
}

// Normalize raw clipboard HTML from outside the editor. Runs before the
// editor parses the paste, so the fake-list conversion still sees the
// mso-list styles it needs, and the style-to-class conversion runs before the
// schema would drop the style attributes.
export const normalizePastedHtml = (html: string): string => {
  if (typeof DOMParser === 'undefined' || !html) return html

  const doc = new DOMParser().parseFromString(html, 'text/html')
  removeWordArtifacts(doc)
  normalizeTables(doc)
  convertWordFakeLists(doc)
  normalizeDoc(doc)
  removeUnknownClasses(doc)

  // Word separates its paragraphs with literal newlines; whitespace-only text
  // between the blocks is not content.
  for (const node of Array.from(doc.body.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) {
      doc.body.removeChild(node)
    }
  }

  return doc.body.innerHTML
}
