import {
  findNearestHighlightColor,
  HIGHLIGHT_COLORS,
  normalizePastedHighlights,
  normalizePastedIndentation,
  parseCssColor,
} from './pasteNormalization'

const YELLOW = HIGHLIGHT_COLORS[0].color
const BLUE = HIGHLIGHT_COLORS[1].color

describe('parseCssColor', () => {
  it('resolves Word highlighter color keywords', () => {
    expect(parseCssColor('yellow')).toEqual([255, 255, 0])
    expect(parseCssColor('cyan')).toEqual([0, 255, 255])
    expect(parseCssColor('magenta')).toEqual([255, 0, 255])
  })

  it('is case- and whitespace-insensitive for keywords', () => {
    expect(parseCssColor(' Yellow ')).toEqual([255, 255, 0])
  })

  it('parses 6-digit and 3-digit hex', () => {
    expect(parseCssColor('#fff066')).toEqual([255, 240, 102])
    expect(parseCssColor('#ff0')).toEqual([255, 255, 0])
  })

  it('parses rgb() and opaque rgba()', () => {
    expect(parseCssColor('rgb(204, 223, 255)')).toEqual([204, 223, 255])
    expect(parseCssColor('rgba(204, 223, 255, 0.5)')).toEqual([204, 223, 255])
  })

  it('treats a fully transparent rgba value as no color', () => {
    expect(parseCssColor('rgba(255, 255, 0, 0)')).toBeNull()
  })

  it('does not resolve non-highlight keywords', () => {
    // These come from Word's default (non-highlighted) shading and would
    // render as black rectangles in the PDF if treated as colors.
    expect(parseCssColor('transparent')).toBeNull()
    expect(parseCssColor('windowtext')).toBeNull()
    expect(parseCssColor('white')).toBeNull()
    expect(parseCssColor('inherit')).toBeNull()
  })

  it('returns null for unparseable input', () => {
    expect(parseCssColor('not-a-color')).toBeNull()
    expect(parseCssColor('')).toBeNull()
  })
})

describe('findNearestHighlightColor', () => {
  it('maps every palette color to itself', () => {
    for (const { color } of HIGHLIGHT_COLORS) {
      expect(findNearestHighlightColor(color)).toBe(color)
    }
  })

  it('maps a palette color given in rgb() form to its hex value', () => {
    const [r, g, b] = parseCssColor(BLUE) ?? []
    expect(findNearestHighlightColor(`rgb(${r}, ${g}, ${b})`)).toBe(BLUE)
  })

  it('snaps Word yellow to the palette yellow', () => {
    expect(findNearestHighlightColor('yellow')).toBe(YELLOW)
  })

  it('falls back to the first palette color for distant colors', () => {
    // Black is further than the snap threshold from every palette color.
    expect(findNearestHighlightColor('black')).toBe(YELLOW)
  })

  it('falls back to the first palette color for unparseable input', () => {
    expect(findNearestHighlightColor('windowtext')).toBe(YELLOW)
  })
})

describe('normalizePastedHighlights', () => {
  it('rewrites the Word "background" shorthand to a palette background-color', () => {
    // Word emits highlights as "background:yellow" — the shorthand, a keyword
    // color — after the paste plugin's Word filter has run.
    expect(
      normalizePastedHighlights('<span style="background:yellow">x</span>'),
    ).toBe(`<span style="background-color: ${YELLOW};">x</span>`)
  })

  it('snaps a background-color hex value to the palette', () => {
    expect(
      normalizePastedHighlights(
        '<span style="background-color: #ffff00;">x</span>',
      ),
    ).toBe(`<span style="background-color: ${YELLOW};">x</span>`)
  })

  it('strips transparent and windowtext backgrounds entirely', () => {
    expect(
      normalizePastedHighlights(
        '<span style="background-color: transparent;">x</span>' +
          '<span style="background:windowtext;">y</span>',
      ),
    ).not.toContain('background')
  })

  it('strips a zero-alpha rgba background', () => {
    expect(
      normalizePastedHighlights(
        '<span style="background-color: rgba(0, 0, 0, 0);">x</span>',
      ),
    ).not.toContain('background')
  })

  it('leaves other styles in the same attribute intact', () => {
    const result = normalizePastedHighlights(
      '<span style="font-weight:bold;background:yellow;font-style:italic">x</span>',
    )
    expect(result).toContain('font-weight:bold')
    expect(result).toContain('font-style:italic')
    expect(result).toContain(`background-color: ${YELLOW};`)
  })

  it('does not change content without backgrounds', () => {
    const html = '<p>plain <strong>bold</strong> text</p>'
    expect(normalizePastedHighlights(html)).toBe(html)
  })

  it('is idempotent, so re-pasting editor content is a no-op', () => {
    const once = normalizePastedHighlights(
      '<p><span style="background:lime">a</span> and ' +
        '<span style="background-color: rgb(255, 255, 0);">b</span></p>',
    )
    expect(normalizePastedHighlights(once)).toBe(once)
  })
})

describe('normalizePastedIndentation', () => {
  it('converts a one-level Word indent (36pt) to a 40px padding step', () => {
    expect(
      normalizePastedIndentation('<p style="margin-left:36.0pt;">x</p>'),
    ).toBe('<p style="padding-left: 40px;">x</p>')
  })

  it('converts a two-level Word indent (72pt) to an 80px padding step', () => {
    expect(
      normalizePastedIndentation('<p style="margin-left:72.0pt;">x</p>'),
    ).toBe('<p style="padding-left: 80px;">x</p>')
  })

  it('rounds px margins to the nearest indent step', () => {
    expect(
      normalizePastedIndentation('<p style="margin-left: 85px;">x</p>'),
    ).toBe('<p style="padding-left: 80px;">x</p>')
  })

  it('removes margins smaller than half an indent step', () => {
    expect(
      normalizePastedIndentation('<p style="margin-left: 10px;">x</p>'),
    ).toBe('<p style="">x</p>')
  })

  it('does not change content without margin-left', () => {
    const html = '<p style="padding-left: 40px;">already normalized</p>'
    expect(normalizePastedIndentation(html)).toBe(html)
  })
})
