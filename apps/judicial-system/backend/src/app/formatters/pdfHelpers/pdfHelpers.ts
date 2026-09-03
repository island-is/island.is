import type { ChildNode, Element, Text } from 'domhandler'
import { parseDocument } from 'htmlparser2'
import { PDFFont, PDFPage } from 'pdf-lib'

import { formatDate, lowercase } from '@island.is/judicial-system/formatters'

import { coatOfArms } from '../svgs/coatOfArms'
import { policeStar } from '../svgs/policeStar'

export interface Confirmation {
  actor: string
  title?: string
  institution: string
  date: Date
}

export const calculatePt = (px: number) => Math.ceil(px * 0.74999943307122)
export const xsFontSize = 5
export const smallFontSize = 9
export const baseFontSize = 11
export const basePlusFontSize = 12
export const mediumFontSize = 14
export const mediumPlusFontSize = 16
export const largeFontSize = 18
export const hugeFontSize = 26
export const giganticFontSize = 33

const lightGray = '#FAFAFA'
const darkGray = '#CBCBCB'
const gold = '#ADA373'

const setFont = (doc: PDFKit.PDFDocument, font?: string) => {
  if (font) {
    doc.font(font)
  }
}

const addAlignedText = (
  doc: PDFKit.PDFDocument,
  fontSize: number,
  heading: string,
  alignment: 'center' | 'left' | 'right' | 'justify',
  font?: string,
) => {
  setFont(doc, font)

  doc.fontSize(fontSize).text(heading, { align: alignment, paragraphGap: 1 })
}

const addText = (
  doc: PDFKit.PDFDocument,
  fontSize: number,
  text: string,
  font?: string,
  continued = false,
) => {
  setFont(doc, font)

  doc.fontSize(fontSize).text(text, { continued, paragraphGap: 1 })
}

export const setTitle = (doc: PDFKit.PDFDocument, title: string) => {
  if (doc.info) {
    doc.info['Title'] = title
  }
}

export const addFooter = (doc: PDFKit.PDFDocument, smallPrint?: string) => {
  const pages = doc.bufferedPageRange()
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i)

    // Set aside the margins and reset to ensure proper alignment
    const oldMargins = doc.page.margins
    doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 }
    doc.text(`${i + 1}`, 0, doc.page.height - (oldMargins.bottom * 2) / 3, {
      align: 'center',
    })

    if (smallPrint) {
      doc
        .fontSize(smallFontSize)
        .text(smallPrint, 0, doc.page.height - (oldMargins.bottom * 5) / 12, {
          align: 'center',
        })
    }

    // Reset margins
    doc.page.margins = oldMargins
  }
}

export const addCoatOfArms = (
  doc: PDFKit.PDFDocument,
  x?: number,
  y?: number,
  scale?: number,
) => {
  doc.save()

  doc.translate(x ?? 270, y ?? 70).scale(scale ?? 0.4)

  coatOfArms(doc)

  doc.fillColor('black')
  doc.restore()
}

export const addPoliceStar = (doc: PDFKit.PDFDocument) => {
  doc.translate(270, 70).scale(0.04)

  doc.image(policeStar, 0, 0, { fit: [1350, 1350] })

  doc.scale(25).translate(-270, -70)
}

interface InfoBox {
  title: string
  content: string
  widthPercent: number // 0-100
}

interface ConfirmationConfig {
  boxes: InfoBox[]
  confirmationText: string
  showLockIcon?: boolean
  date?: Date
}

export const formatActor = (name: string, title?: string) => {
  return `${name}${title ? `, ${lowercase(title)}` : ''}`
}

export const drawConfirmation = (
  doc: PDFKit.PDFDocument,
  config: ConfirmationConfig,
) => {
  const { boxes, confirmationText, showLockIcon = false, date } = config

  const pageMargin = calculatePt(18)
  const shaddowHeight = calculatePt(48)
  const coatOfArmsHeight = calculatePt(48)
  const coatOfArmsWidth = calculatePt(88)
  const coatOfArmsX = pageMargin + calculatePt(8)
  const titleHeight = calculatePt(16)
  const titleX = coatOfArmsX + coatOfArmsWidth + calculatePt(8)
  const fontSize = calculatePt(xsFontSize) * 0.7

  // Page width minus 2 times the page margin
  const totalWidth = doc.page.width - pageMargin * 2
  const availableBoxWidth = totalWidth - coatOfArmsWidth

  doc.save()

  doc.x = pageMargin
  doc.y = pageMargin

  // Draw the shaddow background
  doc.rect(doc.x, doc.y, totalWidth, shaddowHeight).fill(lightGray)

  // Draw the Coat of Arms box. Note that the x and y is offset by
  // 8pts to create a shadow effect
  doc
    .rect(
      doc.x + calculatePt(8),
      doc.y - calculatePt(8),
      coatOfArmsWidth,
      coatOfArmsHeight,
    )
    .fillAndStroke('white', darkGray)

  // Draw the actual Coat of Arms. Note that the x and y is offset by
  // some magic numbers to center it in the box
  addCoatOfArms(doc, doc.x + calculatePt(35), doc.y - calculatePt(1), 0.25)

  // Draw the title box
  const titleBoxY = doc.y - calculatePt(8)
  const titleTextY = titleBoxY + titleHeight / 2 - fontSize / 2

  doc
    .rect(
      coatOfArmsX + coatOfArmsWidth,
      titleBoxY,
      totalWidth - coatOfArmsWidth,
      titleHeight,
    )
    .fillAndStroke(lightGray, darkGray)

  // Draw the title text
  doc.fill('black')
  doc.font('Times-Bold')
  doc
    .fontSize(calculatePt(xsFontSize))
    .text('Réttarvörslugátt', titleX, titleTextY, {
      continued: true,
      lineBreak: false,
    })

  doc.text('  ', { continued: true })

  doc.font('Times-Roman')
  doc.text(confirmationText, { lineBreak: false })

  // Draw lock icon if needed
  if (showLockIcon) {
    doc
      .translate(totalWidth + calculatePt(8), doc.y - calculatePt(8))
      .scale(0.5)
      .path(
        'M2.76356 11.8047H9.57201C9.85402 11.8047 10.0826 11.5761 10.0826 11.2941V5.50692C10.0826 5.22492 9.85402 4.99629 9.57201 4.99629H9.06138V3.46439C9.06138 1.86887 7.76331 0.570801 6.16779 0.570801C4.57226 0.570801 3.2742 1.86887 3.2742 3.46439V4.99629H2.76356C2.48156 4.99629 2.25293 5.22492 2.25293 5.50692V11.2941C2.25293 11.5761 2.48156 11.8047 2.76356 11.8047ZM7.61394 8.03817L6.16714 9.48496C6.06743 9.58467 5.93674 9.63455 5.80609 9.63455C5.67543 9.63455 5.54471 9.58467 5.44504 9.48496L4.72164 8.76157C4.52222 8.56215 4.52222 8.23888 4.72164 8.03943C4.92102 7.84001 5.24436 7.84001 5.44378 8.03943L5.80612 8.40174L6.89187 7.31603C7.09125 7.11661 7.41458 7.11661 7.614 7.31603C7.81339 7.51549 7.81339 7.83875 7.61394 8.03817ZM4.29546 3.46439C4.29546 2.43199 5.13539 1.59207 6.16779 1.59207C7.20019 1.59207 8.04011 2.43199 8.04011 3.46439V4.99629H4.29546V3.46439Z',
      )
      .lineWidth(0.5)
      .fillAndStroke(gold, gold)

    doc.restore()
  } else if (date) {
    const dateString = formatDate(date) ?? ''
    const dateWidth = doc.widthOfString(dateString)

    doc
      .fontSize(calculatePt(xsFontSize))
      .text(
        formatDate(date) ?? '',
        coatOfArmsX +
          coatOfArmsWidth +
          (totalWidth - coatOfArmsWidth) -
          dateWidth -
          calculatePt(8),
        titleTextY,
        {
          align: 'right',
          width: dateWidth,
        },
      )
  }

  const boxY = titleBoxY + titleHeight
  const boxHeight = shaddowHeight - titleHeight
  let currentX = coatOfArmsX + coatOfArmsWidth

  boxes.forEach((box) => {
    // Draw the box
    const boxWidth = (availableBoxWidth * box.widthPercent) / 100

    doc
      .rect(currentX, boxY, boxWidth, boxHeight)
      .fillAndStroke('white', darkGray)
    doc.fill('black')
    doc.font('Times-Bold')
    doc.text(box.title, currentX + calculatePt(8), boxY + calculatePt(9), {
      lineGap: 1,
      width: boxWidth - calculatePt(16),
    })
    doc.font('Times-Roman')
    doc.text(box.content)

    currentX += boxWidth
  })

  doc.fillColor('black')
}

export const setLineGap = (doc: PDFKit.PDFDocument, lineGap: number) => {
  doc.lineGap(lineGap)
}

export const drawTextWithEllipsis = (
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
) => {
  const ellipsis = '...'
  let width = doc.widthOfString(text)
  if (width <= maxWidth) {
    doc.text(text, x, y)
  } else {
    while (width > maxWidth - doc.widthOfString(ellipsis)) {
      text = text.slice(0, -1)
      width = doc.widthOfString(text)
    }
    doc.text(text + ellipsis, x, y)
  }
}

export const drawTextWithEllipsisPDFKit = (
  doc: PDFPage,
  text: string,
  font: { type: PDFFont; size: number },
  x: number,
  y: number,
  maxWidth: number,
) => {
  const ellipsis = '...'
  let width = font.type.widthOfTextAtSize(text, font.size)
  if (width <= maxWidth) {
    doc.drawText(text, { x, y, font: font.type, size: font.size })
  } else {
    while (
      width >
      maxWidth - font.type.widthOfTextAtSize(ellipsis, font.size)
    ) {
      text = text.slice(0, -1)
      width = font.type.widthOfTextAtSize(text, font.size)
    }
    doc.drawText(text + ellipsis, {
      x,
      y,
      font: font.type,
      size: font.size,
    })
  }
}

export const addEmptyLines = (
  doc: PDFKit.PDFDocument,
  lines = 1,
  x?: number,
) => {
  for (let i = 0; i < lines; i++) {
    doc.text(' ', x)
  }
}

export const addGiganticHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addAlignedText(doc, giganticFontSize, heading, 'center', font)
}

export const addHugeHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addAlignedText(doc, hugeFontSize, heading, 'center', font)
}

export const addLargeHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addAlignedText(doc, largeFontSize, heading, 'center', font)
}

export const addMediumPlusHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addAlignedText(doc, mediumPlusFontSize, heading, 'center', font)
}

export const addMediumHeading = (
  doc: PDFKit.PDFDocument,
  heading: string,
  font?: string,
) => {
  addAlignedText(doc, mediumFontSize, heading, 'center', font)
}

export const addLargeText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addText(doc, largeFontSize, text, font)
}

export const addMediumText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addText(doc, mediumFontSize, text, font)
}

export const addMediumCenteredText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addAlignedText(doc, mediumFontSize, text, 'center', font)
}

export const addNormalPlusText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
  continued?: boolean,
) => {
  addText(doc, basePlusFontSize, text, font, continued)
}

export const addNormalPlusCenteredText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addAlignedText(doc, basePlusFontSize, text, 'center', font)
}

export const addNormalText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
  continued?: boolean,
) => {
  addText(doc, baseFontSize, text, font, continued)
}

export const addNormalJustifiedText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addAlignedText(doc, baseFontSize, text, 'justify', font)
}

export const addNormalPlusJustifiedText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addAlignedText(doc, basePlusFontSize, text, 'justify', font)
}

export const addNormalCenteredText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addAlignedText(doc, baseFontSize, text, 'center', font)
}

export const addNormalRightAlignedText = (
  doc: PDFKit.PDFDocument,
  text: string,
  font?: string,
) => {
  addAlignedText(doc, baseFontSize, text, 'right', font)
}

export const addNumberedList = (
  doc: PDFKit.PDFDocument,
  items: string[],
  start = 1,
  font?: string,
) => {
  const originalX = doc.x

  setFont(doc, font)

  const x = doc.page.margins.left + 18
  const gap = 6

  const maxIndex = start + items.length - 1
  const labelExample = `${maxIndex}.`
  const labelBoxWidth = doc.widthOfString(labelExample)

  const rightMargin = doc.page.margins.right
  const itemX = x + labelBoxWidth + gap
  const wrapWidth = doc.page.width - rightMargin - itemX

  const pageBottomY = doc.page.height - doc.page.margins.bottom

  for (const [i, item] of items.entries()) {
    const label = `${start + i}`
    // PDFKit wraps on whitespace and also splits oversized unbroken tokens.
    const textHeight = doc.heightOfString(item, {
      width: wrapWidth,
    })
    const labelWidth = doc.widthOfString(label)
    const labelX = x + (labelBoxWidth - labelWidth)

    if (doc.y + textHeight > pageBottomY) {
      doc.addPage()
    }
    const y = doc.y

    doc.text(label, labelX, y, { lineBreak: false })
    doc.text(item, itemX, y, { width: wrapWidth })
  }

  doc.x = originalX
}

interface Run {
  text: string
  bold: boolean
  italic: boolean
  highlight: string | false
}

export interface RichTextTableCell {
  blocks: RichTextBlock[]
}

export interface RichTextTableRow {
  cells: RichTextTableCell[]
}

export interface RichTextBlock {
  runs: Run[]
  indent: number
  softBreak?: boolean
  // List marker drawn in the gutter to the left of the block ("•" or "3.").
  marker?: string
  // Present when the block is a table; runs is empty in that case. Rows may
  // be ragged (defensive merged-cell flattening) — they are padded to the
  // table's column count at render time.
  table?: { rows: RichTextTableRow[] }
}

// Values that mean "no highlight" and must not be drawn as a filled rect.
// PDFKit cannot parse these and would fall back to a solid black fill.
const NON_HIGHLIGHT_BG = new Set([
  'transparent',
  'inherit',
  'initial',
  'unset',
  'none',
  '',
])

// The editor stores highlights as hl-xxxxxx classes and indentation as
// indent-N classes (see the web app's richTextNormalization.ts) — inline
// styles cannot be used because the WAF in front of the API rejects request
// bodies containing a style="..." attribute. Style parsing below is kept as a
// fallback for legacy content saved before the switch to classes.
const HIGHLIGHT_CLASS_REGEX = /(?:^|\s)hl-([0-9a-f]{6})(?:\s|$)/i
const INDENT_CLASS_REGEX = /(?:^|\s)indent-(\d+)(?:\s|$)/

// The editor indents 40px per level; 0.75 converts that to PDF points.
const INDENT_LEVEL_PT = 30
const MAX_INDENT_LEVEL = 10

// Lists are indented one level per nesting depth, matching the browser's
// default 40px padding on ul/ol. The marker is right-aligned in that gutter,
// ending LIST_MARKER_GAP_PT before the item text.
const LIST_INDENT_PT = INDENT_LEVEL_PT
const LIST_MARKER_GAP_PT = 6
const BULLET = '•'

const extractBgColor = (style: string): string | null => {
  const m = style.match(/background-color:\s*([^;]+)/)
  if (!m) return null

  const value = m[1].trim()
  const normalized = value.toLowerCase()

  if (NON_HIGHLIGHT_BG.has(normalized)) return null

  // rgba(...) with a zero alpha channel is also effectively transparent. Match
  // only the four-component rgba() form so an opaque rgb(r, g, 0) (e.g. yellow)
  // is not mistaken for transparent.
  if (/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0*\.?0+\s*\)/.test(normalized))
    return null

  // Browsers serialize inline styles in rgb()/rgba() form, but PDFKit only
  // understands hex and named colors, so convert before handing it to fill().
  const rgb = normalized.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgb) {
    const toHex = (part: string) =>
      Math.min(255, parseInt(part, 10)).toString(16).padStart(2, '0')
    return `#${toHex(rgb[1])}${toHex(rgb[2])}${toHex(rgb[3])}`
  }

  return value
}

const collectRuns = (
  nodes: ChildNode[],
  bold: boolean,
  italic: boolean,
  highlight: string | false,
  result: Run[],
): void => {
  for (const node of nodes) {
    if (node.type === 'text') {
      const text = (node as Text).data
      if (text) result.push({ text, bold, italic, highlight })
      continue
    }
    if (node.type !== 'tag') continue
    const el = node as Element
    const children = el.children ?? []
    if (el.name === 'strong' || el.name === 'b') {
      collectRuns(children, true, italic, highlight, result)
    } else if (el.name === 'em' || el.name === 'i') {
      collectRuns(children, bold, true, highlight, result)
    } else if (
      el.name === 'span' &&
      (el.attribs?.class || el.attribs?.style?.includes('background-color'))
    ) {
      // A span without a highlight class, or with a transparent/invalid
      // background, means no highlight, so inherit the current highlight
      // state rather than forcing a fill.
      const classMatch = el.attribs?.class?.match(HIGHLIGHT_CLASS_REGEX)
      const color = classMatch
        ? `#${classMatch[1].toLowerCase()}`
        : (el.attribs?.style && extractBgColor(el.attribs.style)) || highlight
      collectRuns(children, bold, italic, color, result)
    } else if (el.name === 'br') {
      result.push({ text: '\n', bold: false, italic: false, highlight: false })
    } else {
      collectRuns(children, bold, italic, highlight, result)
    }
  }
}

const indentFromClass = (el: Element): number => {
  const classMatch = el.attribs?.class?.match(INDENT_CLASS_REGEX)

  return classMatch
    ? Math.min(MAX_INDENT_LEVEL, parseInt(classMatch[1], 10)) * INDENT_LEVEL_PT
    : 0
}

// Split inline content on <br> and turn each segment into one block, the way a
// paragraph's own children are laid out.
const collectInlineBlocks = (
  nodes: ChildNode[],
  indent: number,
): RichTextBlock[] => {
  const segments: ChildNode[][] = [[]]
  for (const child of nodes) {
    if (child.type === 'tag' && (child as Element).name === 'br') {
      segments.push([])
    } else {
      segments[segments.length - 1].push(child)
    }
  }
  if (segments.length > 1 && segments[segments.length - 1].length === 0) {
    segments.pop()
  }

  return segments.map((segment, s) => {
    const runs: Run[] = []
    collectRuns(segment, false, false, false, runs)

    return { runs, indent, softBreak: s < segments.length - 1 }
  })
}

// Tags that start a block of their own inside a list item, as opposed to inline
// content that belongs on the marker's line.
const BLOCK_LEVEL_TAGS = new Set(['p', 'div', 'blockquote', 'ul', 'ol', 'li'])

// An indent-N class on the item itself is deliberately ignored: Word indents
// its list items with margin-left as well as nesting them, so honouring both
// would double the indentation of every nested level.
const collectListItemBlocks = (
  el: Element,
  indent: number,
  marker: string,
): RichTextBlock[] => {
  // An item is usually inline content, but it can also hold paragraphs or a
  // nested list. Keep the two apart so inline formatting on the item's own text
  // survives (collectRuns) while nested blocks recurse.
  const inline: ChildNode[] = []
  const nested: ChildNode[] = []
  for (const child of el.children ?? []) {
    if (child.type === 'tag' && BLOCK_LEVEL_TAGS.has((child as Element).name)) {
      nested.push(child)
    } else if (nested.length > 0) {
      // Text trailing a nested list belongs after it, not on the marker line.
      nested.push(child)
    } else {
      inline.push(child)
    }
  }

  // Whitespace between an item's tags is not content — without this check an
  // item that only wraps a paragraph would put its marker on a blank line.
  const hasInlineContent = inline.some(
    (node) => node.type !== 'text' || (node as Text).data.trim() !== '',
  )

  const blocks = hasInlineContent ? collectInlineBlocks(inline, indent) : []
  blocks.push(...collectBlocksFromNodes(nested, indent))

  if (blocks.length === 0) {
    blocks.push({ runs: [], indent })
  }

  // A marker on the first block means the item holds nothing but a nested list,
  // whose own first item already owns that block. Such an item is a structural
  // wrapper, not a line of its own: the editor creates one whenever an item is
  // indented past the nesting available to it, and renders it without a marker.
  // Leave the child's marker alone — overwriting it would drop a nested ordered
  // list's starting number, and adding another would draw a stray bullet.
  if (!blocks[0].marker) {
    blocks[0].marker = marker
  }

  return blocks
}

const collectListBlocks = (el: Element, indent: number): RichTextBlock[] => {
  const ordered = el.name === 'ol'
  const start = parseInt(el.attribs?.start ?? '', 10)
  let counter = Number.isFinite(start) ? start : 1

  const itemIndent = indent + indentFromClass(el) + LIST_INDENT_PT
  const blocks: RichTextBlock[] = []

  for (const child of el.children ?? []) {
    if (child.type !== 'tag') continue
    const item = child as Element
    // A nested list is a sibling of the items in some pasted markup; give it
    // its own level rather than dropping it.
    if (item.name === 'ul' || item.name === 'ol') {
      blocks.push(...collectListBlocks(item, itemIndent))
      continue
    }
    if (item.name !== 'li') continue

    blocks.push(
      ...collectListItemBlocks(
        item,
        itemIndent,
        ordered ? `${counter}.` : BULLET,
      ),
    )
    counter++
  }

  return blocks
}

const TABLE_SECTION_TAGS = new Set(['thead', 'tbody', 'tfoot'])

// The editor serializes tables as <table><tbody><tr><td> with paragraph (and
// list) content in the cells, but legacy or pasted HTML may put tr directly
// under table (htmlparser2 does no tree construction, so no tbody is
// synthesized), use th, or carry colspan/rowspan. th is treated as a plain
// cell and the span attributes are ignored — each td/th becomes one cell in
// source order, so merged legacy tables flatten instead of crashing;
// caption/colgroup hold no cell content and are skipped.
const collectTableBlock = (el: Element): { rows: RichTextTableRow[] } => {
  const rows: RichTextTableRow[] = []

  const collectRows = (nodes: ChildNode[]) => {
    for (const node of nodes) {
      if (node.type !== 'tag') continue
      const child = node as Element
      if (TABLE_SECTION_TAGS.has(child.name)) {
        collectRows(child.children ?? [])
      } else if (child.name === 'tr') {
        const cells: RichTextTableCell[] = []
        for (const cellNode of child.children ?? []) {
          if (cellNode.type !== 'tag') continue
          const cellEl = cellNode as Element
          if (cellEl.name !== 'td' && cellEl.name !== 'th') continue
          cells.push({ blocks: collectBlocksFromNodes(cellEl.children ?? []) })
        }
        if (cells.length > 0) {
          rows.push({ cells })
        }
      }
    }
  }

  collectRows(el.children ?? [])
  return { rows }
}

const collectBlocksFromNodes = (
  nodes: ChildNode[],
  indent = 0,
): RichTextBlock[] => {
  const blocks: RichTextBlock[] = []

  for (const node of nodes) {
    if (node.type === 'text') {
      const text = (node as Text).data.trim()
      if (text) {
        blocks.push({
          runs: [{ text, bold: false, italic: false, highlight: false }],
          indent,
        })
      }
      continue
    }
    if (node.type !== 'tag') continue
    const el = node as Element
    const children = el.children ?? []

    if (el.name === 'p') {
      const style = el.attribs?.style ?? ''
      const paddingMatch = style.match(/padding-left:\s*(\d+(?:\.\d+)?)px/)
      const classIndent = indentFromClass(el)
      const pIndent = classIndent
        ? classIndent
        : paddingMatch
        ? Math.round(parseFloat(paddingMatch[1]) * 0.75)
        : 0

      blocks.push(...collectInlineBlocks(children, indent + pIndent))
    } else if (el.name === 'ul' || el.name === 'ol') {
      blocks.push(...collectListBlocks(el, indent))
    } else if (el.name === 'table') {
      const table = collectTableBlock(el)
      if (table.rows.length > 0) {
        blocks.push({ runs: [], indent: indent + indentFromClass(el), table })
      }
    } else {
      // The editor also puts indent-N on div/li/blockquote (legacy or pasted
      // content), and its content CSS indents any element carrying the class —
      // so carry the level down onto the blocks nested inside.
      blocks.push(
        ...collectBlocksFromNodes(children, indent + indentFromClass(el)),
      )
    }
  }

  return blocks
}

// Collapse whitespace within a block the way a browser renders inline content
// (white-space: normal): runs of spaces become one, and leading/trailing
// whitespace is dropped. Without this, Word's empty `<span> </span>` spacers
// render as literal spaces in the PDF even though the editor hides them.
const collapseWhitespace = (runs: Run[]): Run[] => {
  const collapsed: Run[] = []
  // Start true so leading whitespace at the block start is trimmed.
  let prevEndsWithSpace = true

  for (const run of runs) {
    // A <br>-derived run is a hard break; keep it and reset the space state.
    if (run.text === '\n') {
      collapsed.push(run)
      prevEndsWithSpace = true
      continue
    }

    let text = run.text.replace(/[ \t\r\n]+/g, ' ')
    if (prevEndsWithSpace && text.startsWith(' ')) {
      text = text.slice(1)
    }
    if (text === '') continue

    collapsed.push({ ...run, text })
    prevEndsWithSpace = text.endsWith(' ')
  }

  const last = collapsed[collapsed.length - 1]
  if (last && last.text.endsWith(' ')) {
    last.text = last.text.replace(/ +$/, '')
    if (last.text === '') collapsed.pop()
  }

  return collapsed
}

// Whitespace collapsing must reach the blocks nested inside table cells too;
// for a block without a table this is exactly the flat map it always was.
const normalizeBlocks = (blocks: RichTextBlock[]): RichTextBlock[] =>
  blocks.map((block) => ({
    ...block,
    runs: collapseWhitespace(block.runs),
    ...(block.table && {
      table: {
        rows: block.table.rows.map((row) => ({
          cells: row.cells.map((cell) => ({
            blocks: normalizeBlocks(cell.blocks),
          })),
        })),
      },
    }),
  }))

export const htmlToBlocks = (html: string): RichTextBlock[] =>
  normalizeBlocks(collectBlocksFromNodes(parseDocument(html).children))

const getFontName = (run: Run): string => {
  if (run.bold && run.italic) return 'Times-BoldItalic'
  if (run.bold) return 'Times-Bold'
  if (run.italic) return 'Times-Italic'
  return 'Times-Roman'
}

interface LineFragment {
  text: string
  x: number
  width: number
  font: string
  highlight: string | false
}

// Descender depth of the standard Times fonts, in 1/1000s of the font size
// (AFM "Descender -217" — identical across all four Times variants).
const TIMES_DESCENDER = 217

const TABLE_CELL_PADDING = 5
const TABLE_BORDER_WIDTH = 0.5

// All Times variants share their vertical metrics, so the line geometry can
// be computed once per block (or table) from the regular face.
const getLineMetrics = (
  doc: PDFKit.PDFDocument,
  fontSize: number,
  lineGap: number,
) => {
  doc.font('Times-Roman').fontSize(fontSize)
  const lineHeight = doc.currentLineHeight(true)
  return {
    lineHeight,
    lineAdvance: lineHeight + lineGap,
    visibleHeight: doc.currentLineHeight(false),
    // Shift rects up by half the descender height to centre them around the
    // visible glyphs.
    descender: (TIMES_DESCENDER / 1000) * fontSize,
  }
}

type LineMetrics = ReturnType<typeof getLineMetrics>

interface LaidOutLine {
  fragments: LineFragment[]
}

interface BlockLayout {
  lines: LaidOutLine[]
  // The list marker with its final x, drawn on the block's first line. It
  // sits in the gutter opened up by the list indent, right-aligned so wider
  // ordered-list labels ("10.") stay clear of the item text, and never left
  // of markerFloorX (the page margin, or the cell edge inside a table).
  marker?: { text: string; x: number }
}

// Lays out one block word by word into lines of positioned fragments, without
// drawing anything. Every quantity that feeds a fragment coordinate (leftX,
// width, font measurements, justification slack) is independent of y, so the
// caller can decide page placement afterwards — the main flow draws line by
// line as before, and table cells measure every cell before choosing a row
// height and page.
const layoutBlockLines = (
  doc: PDFKit.PDFDocument,
  block: RichTextBlock,
  leftX: number,
  width: number,
  fontSize: number,
  alignment: 'left' | 'justify',
  markerFloorX: number,
): BlockLayout => {
  doc.font('Times-Roman').fontSize(fontSize)

  let marker: BlockLayout['marker']
  if (block.marker) {
    const markerWidth = doc.widthOfString(block.marker)
    marker = {
      text: block.marker,
      x: Math.max(markerFloorX, leftX - LIST_MARKER_GAP_PT - markerWidth),
    }
  }

  const lines: LaidOutLine[] = []
  let x = leftX
  let lineFragments: LineFragment[] = []

  // Stretch a wrapped line to the full block width by widening the gaps
  // between words evenly. Fragment x/width values are adjusted in place
  // before anything is drawn, so the highlight rects (computed from the same
  // fragments) widen with the spaces they cover.
  const justifyLineFragments = () => {
    const last = lineFragments[lineFragments.length - 1]
    doc.font(last.font).fontSize(fontSize)
    const lineEnd = last.x + doc.widthOfString(last.text.trimEnd())
    const slack = leftX + width - lineEnd
    if (slack <= 0) return

    // Words carry their single trailing space, and inter-run spaces are lone
    // ' ' tokens, so every gap is a fragment ending in a space.
    const gaps = lineFragments.filter(
      (fragment, index) =>
        index < lineFragments.length - 1 && fragment.text.endsWith(' '),
    ).length
    if (gaps === 0) return

    const extra = slack / gaps
    let offset = 0
    for (let i = 0; i < lineFragments.length; i++) {
      const fragment = lineFragments[i]
      fragment.x += offset
      if (i < lineFragments.length - 1 && fragment.text.endsWith(' ')) {
        fragment.width += extra
        offset += extra
      }
    }
  }

  const closeLine = (justifyLine = false) => {
    if (alignment === 'justify' && justifyLine && lineFragments.length > 0) {
      justifyLineFragments()
    }
    lines.push({ fragments: lineFragments })
    lineFragments = []
    x = leftX
  }

  for (const run of block.runs) {
    // Hard break from a <br> nested below the paragraph level.
    if (run.text === '\n') {
      closeLine()
      continue
    }

    const font = getFontName(run)
    doc.font(font).fontSize(fontSize)

    // Whitespace is already collapsed, so tokens are words with their
    // single trailing space attached, or a lone inter-run space.
    const tokens = run.text.match(/\S+ ?| /g) ?? []
    for (let token of tokens) {
      // Drop spaces that would start a wrapped line.
      if (token === ' ' && x === leftX) continue

      let tokenWidth = doc.widthOfString(token)
      const wordWidth = token.endsWith(' ')
        ? doc.widthOfString(token.trimEnd())
        : tokenWidth
      if (x + wordWidth > leftX + width && x > leftX) {
        // Only wrap-induced breaks justify; hard breaks and the block's last
        // line keep their natural width, as in any word processor.
        closeLine(true)
      }

      // A single token wider than the whole line is chopped to fit.
      while (doc.widthOfString(token.trimEnd()) > width && token.length > 1) {
        let length = token.length - 1
        while (
          length > 1 &&
          doc.widthOfString(token.slice(0, length)) > width
        ) {
          length--
        }
        const head = token.slice(0, length)
        lineFragments.push({
          text: head,
          x,
          width: doc.widthOfString(head),
          font,
          highlight: run.highlight,
        })
        closeLine()
        token = token.slice(length)
      }

      tokenWidth = doc.widthOfString(token)
      lineFragments.push({
        text: token,
        x,
        width: tokenWidth,
        font,
        highlight: run.highlight,
      })
      x += tokenWidth
    }
  }
  closeLine()

  return { lines, marker }
}

// Draws one laid-out line at the given y: one rect per contiguous
// same-colored highlight group, then the text on top.
const drawLine = (
  doc: PDFKit.PDFDocument,
  fragments: LineFragment[],
  y: number,
  fontSize: number,
  metrics: LineMetrics,
) => {
  const hPad = 1

  let i = 0
  let drewRect = false
  while (i < fragments.length) {
    const fragment = fragments[i]
    if (!fragment.highlight) {
      i++
      continue
    }
    let groupWidth = fragment.width
    let end = i + 1
    while (
      end < fragments.length &&
      fragments[end].highlight === fragment.highlight
    ) {
      groupWidth += fragments[end].width
      end++
    }
    doc
      .rect(
        fragment.x - hPad,
        y - metrics.descender / 2 - 1,
        groupWidth + hPad * 2,
        metrics.visibleHeight + metrics.descender + 1,
      )
      .fill(fragment.highlight as string)
    drewRect = true
    i = end
  }
  if (drewRect) {
    doc.fillColor('black')
  }
  for (const fragment of fragments) {
    doc.font(fragment.font).fontSize(fontSize)
    doc.text(fragment.text, fragment.x, y, { lineBreak: false })
  }
}

interface CellLine {
  fragments: LineFragment[]
  // Vertical offset of the line within the cell's content box.
  yOffset: number
  marker?: { text: string; x: number }
}

interface CellLayout {
  lines: CellLine[]
  height: number
}

// A nested table inside a cell cannot be laid out recursively (the editor
// cannot produce one; legacy pasted content might) — flatten it into its host
// cell as consecutive blocks instead.
const flattenCellBlocks = (blocks: RichTextBlock[]): RichTextBlock[] =>
  blocks.flatMap((block) =>
    block.table
      ? block.table.rows.flatMap((row) =>
          row.cells.flatMap((cell) => flattenCellBlocks(cell.blocks)),
        )
      : [block],
  )

// Lays out a cell's blocks within the cell's inner box: the same per-block
// layout as the main flow (cells are always left-aligned — justification in
// narrow columns reads badly and the editor shows cells left-aligned), with
// line positions recorded relative to the cell top so the row can be placed
// on a page later.
const layoutCell = (
  doc: PDFKit.PDFDocument,
  blocks: RichTextBlock[],
  cellLeftX: number,
  cellWidth: number,
  fontSize: number,
  metrics: LineMetrics,
): CellLayout => {
  const lines: CellLine[] = []
  let cursor = 0

  for (const block of flattenCellBlocks(blocks)) {
    const leftX = cellLeftX + block.indent
    // Deeply indented content in a narrow cell keeps at least a sliver of
    // width so the layout always makes progress.
    const width = Math.max(cellWidth - block.indent, fontSize)
    const layout = layoutBlockLines(
      doc,
      block,
      leftX,
      width,
      fontSize,
      'left',
      cellLeftX,
    )

    layout.lines.forEach((line, index) => {
      lines.push({
        fragments: line.fragments,
        yOffset: cursor,
        marker: index === 0 ? layout.marker : undefined,
      })
      cursor += metrics.lineAdvance
    })
    // The same paragraph gap the main flow adds after each block.
    cursor += block.softBreak ? 0 : 1
  }

  if (lines.length === 0) {
    lines.push({ fragments: [], yOffset: 0 })
  }

  return {
    lines,
    height: lines[lines.length - 1].yOffset + metrics.lineHeight,
  }
}

// Draws a table with equal column widths across the available width. Rows are
// measured before they are placed, so a row that no longer fits on the page
// moves to the next one whole; only a row taller than an entire page is split
// at line boundaries, with each page's chunk drawn as a bordered box of its
// own so the split edge reads as a rule.
const renderTable = (
  doc: PDFKit.PDFDocument,
  table: { rows: RichTextTableRow[] },
  indent: number,
  fontSize: number,
  lineGap: number,
) => {
  const columnCount = Math.max(...table.rows.map((row) => row.cells.length))
  if (columnCount <= 0) return

  // Indentation accumulates through nested wrappers and can exceed the
  // writable width. The table is pulled back toward the left margin rather
  // than dropped, and every column keeps a drawable minimum width so cell
  // text stays inside its borders.
  const minColumnWidth = fontSize + 2 * TABLE_CELL_PADDING
  const rightX = doc.page.width - doc.page.margins.right
  const leftX = Math.max(
    doc.page.margins.left,
    Math.min(
      doc.page.margins.left + indent,
      rightX - columnCount * minColumnWidth,
    ),
  )
  const tableWidth = rightX - leftX
  const columnWidth = Math.max(tableWidth / columnCount, minColumnWidth)
  const innerWidth = columnWidth - 2 * TABLE_CELL_PADDING
  const metrics = getLineMetrics(doc, fontSize, lineGap)
  const pageBottomY = () => doc.page.height - doc.page.margins.bottom

  let y = doc.y

  // Draws the lines of every cell whose offset lies in [fromOffset, toOffset)
  // inside a bordered box of the given height: borders first, then content,
  // so highlight fills never sit on a border's antialiasing.
  const drawRowChunk = (
    layouts: CellLayout[],
    top: number,
    chunkHeight: number,
    fromOffset: number,
    toOffset: number,
  ) => {
    doc.lineWidth(TABLE_BORDER_WIDTH)
    for (let column = 0; column < columnCount; column++) {
      doc
        .rect(leftX + column * columnWidth, top, columnWidth, chunkHeight)
        .stroke()
    }
    doc.lineWidth(1)

    for (const layout of layouts) {
      for (const line of layout.lines) {
        if (line.yOffset < fromOffset || line.yOffset >= toOffset) continue
        const lineY = top + TABLE_CELL_PADDING + line.yOffset - fromOffset
        if (line.marker) {
          doc.font('Times-Roman').fontSize(fontSize)
          doc.text(line.marker.text, line.marker.x, lineY, {
            lineBreak: false,
          })
        }
        drawLine(doc, line.fragments, lineY, fontSize, metrics)
      }
    }
  }

  for (const row of table.rows) {
    // Ragged rows (flattened legacy merges) pad with empty cells.
    const cells = [...row.cells]
    while (cells.length < columnCount) {
      cells.push({ blocks: [] })
    }

    const layouts = cells.map((cell, column) =>
      layoutCell(
        doc,
        cell.blocks,
        leftX + column * columnWidth + TABLE_CELL_PADDING,
        innerWidth,
        fontSize,
        metrics,
      ),
    )
    const contentHeight = Math.max(...layouts.map((layout) => layout.height))
    const rowHeight = contentHeight + 2 * TABLE_CELL_PADDING
    const usableHeight =
      doc.page.height - doc.page.margins.top - doc.page.margins.bottom

    if (rowHeight <= usableHeight) {
      // Keep the row intact: move it to the next page when it doesn't fit.
      if (y + rowHeight > pageBottomY()) {
        doc.addPage()
        y = doc.page.margins.top
      }
      drawRowChunk(layouts, y, rowHeight, 0, contentHeight + 1)
      y += rowHeight
    } else {
      // The row can never fit on one page: split it at line boundaries.
      let from = 0
      while (from < contentHeight) {
        let available = pageBottomY() - y - 2 * TABLE_CELL_PADDING
        if (available < metrics.lineHeight) {
          doc.addPage()
          y = doc.page.margins.top
          available = pageBottomY() - y - 2 * TABLE_CELL_PADDING
        }

        const remaining = contentHeight - from
        if (remaining <= available) {
          drawRowChunk(
            layouts,
            y,
            remaining + 2 * TABLE_CELL_PADDING,
            from,
            contentHeight + 1,
          )
          y += remaining + 2 * TABLE_CELL_PADDING
          break
        }

        // Whole lines whose text box fits in the available space; the chunk
        // is as tall as the lines it actually holds.
        const cut = from + available - metrics.lineHeight
        const included = layouts
          .flatMap((layout) => layout.lines.map((line) => line.yOffset))
          .filter((offset) => offset >= from && offset <= cut)
        const to =
          included.length > 0
            ? Math.max(...included) + 0.001
            : from + metrics.lineAdvance
        const chunkContent =
          included.length > 0
            ? Math.max(...included) - from + metrics.lineHeight
            : metrics.lineHeight
        drawRowChunk(
          layouts,
          y,
          chunkContent + 2 * TABLE_CELL_PADDING,
          from,
          to,
        )
        y += chunkContent + 2 * TABLE_CELL_PADDING

        // Resume at the first line the chunk did not hold.
        const upcoming = layouts
          .flatMap((layout) => layout.lines.map((line) => line.yOffset))
          .filter((offset) => offset >= to)
        from = upcoming.length > 0 ? Math.min(...upcoming) : contentHeight
      }
    }
  }

  doc.x = doc.page.margins.left
  // The paragraph-equivalent gap the main flow leaves after a block.
  doc.y = y + lineGap + 1
}

// Lays out and draws each block manually, word by word, instead of letting
// PDFKit wrap a chain of continued text() calls. Highlight rects and text are
// drawn from the same computed coordinates, so they cannot drift apart the way
// a parallel wrap simulation can (wrong line after a wrap, wrong page after a
// page break). lineGap must match the line gap set on the document so this
// text lines up with the surrounding addNormalText output.
export const addRichText = (
  doc: PDFKit.PDFDocument,
  html: string,
  lineGap = 0,
  fontSize = baseFontSize,
  alignment: 'left' | 'justify' = 'left',
): void => {
  const blocks = htmlToBlocks(html)

  for (const block of blocks) {
    // A table block carries no runs of its own; it must be handled before the
    // empty-block check below would swallow it.
    if (block.table) {
      renderTable(doc, block.table, block.indent, fontSize, lineGap)
      continue
    }

    const isEmptyBlock =
      block.runs.length === 0 || block.runs.every((r) => !r.text.trim())

    // An empty list item still needs its marker drawn, so only blank blocks
    // without one collapse to an empty line.
    if (isEmptyBlock && !block.marker) {
      addEmptyLines(doc)
      continue
    }

    const leftX = doc.page.margins.left + block.indent
    const width = doc.page.width - doc.page.margins.right - leftX
    const paragraphGap = block.softBreak ? 0 : 1

    const metrics = getLineMetrics(doc, fontSize, lineGap)
    const layout = layoutBlockLines(
      doc,
      block,
      leftX,
      width,
      fontSize,
      alignment,
      doc.page.margins.left,
    )

    let y = doc.y

    // PDFKit's text() moves to a new page when the next line no longer fits;
    // mirror that so rects and text agree on the page as well.
    const ensureRoom = () => {
      if (y + metrics.lineHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage()
        y = doc.page.margins.top
      }
    }
    ensureRoom()

    // The marker is drawn once, on the item's first line, after ensureRoom so
    // it lands on the same page as that line.
    if (layout.marker) {
      doc.font('Times-Roman').fontSize(fontSize)
      doc.text(layout.marker.text, layout.marker.x, y, { lineBreak: false })
    }

    for (let i = 0; i < layout.lines.length; i++) {
      drawLine(doc, layout.lines[i].fragments, y, fontSize, metrics)
      // The break for the next line is decided after this one is drawn — the
      // same order the interleaved layout used, so page-break points are
      // unchanged.
      if (i < layout.lines.length - 1) {
        y += metrics.lineAdvance
        ensureRoom()
      }
    }

    doc.x = doc.page.margins.left
    doc.y = y + metrics.lineAdvance + paragraphGap
  }

  // Fragment drawing leaves the document font on whatever the last run used
  // (e.g. Times-Bold), and the plain-text helpers only set a font when given
  // one explicitly — restore the default so it doesn't leak into them.
  doc.font('Times-Roman')
}
