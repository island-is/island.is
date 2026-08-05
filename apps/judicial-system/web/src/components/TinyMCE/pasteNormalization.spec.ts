import {
  findNearestHighlightColor,
  normalizePastedHighlights,
  normalizePastedIndentation,
  parseCssColor,
  WORD_HIGHLIGHT_COLORS,
} from './pasteNormalization'

const YELLOW = WORD_HIGHLIGHT_COLORS[0].color

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
    for (const { color } of WORD_HIGHLIGHT_COLORS) {
      expect(findNearestHighlightColor(color)).toBe(color)
    }
  })

  it('maps a palette color given in rgb() form to its hex value', () => {
    expect(findNearestHighlightColor('rgb(0, 128, 128)')).toBe('#008080')
  })

  it('snaps a near-miss color to the nearest palette color', () => {
    expect(findNearestHighlightColor('#fffe10')).toBe(YELLOW)
  })

  it('falls back to yellow for unparseable input', () => {
    expect(findNearestHighlightColor('windowtext')).toBe(YELLOW)
  })
})

describe('normalizePastedHighlights', () => {
  it('rewrites the Word "background" shorthand to a background-color', () => {
    // Word emits highlights as "background:yellow" — the shorthand, a keyword
    // color — after the paste plugin's Word filter has run.
    expect(
      normalizePastedHighlights('<span style="background:yellow">x</span>'),
    ).toBe('<span style="background-color: #ffff00;">x</span>')
  })

  it('preserves each of the 15 Word highlight colors exactly', () => {
    // The CSS keyword Word emits for each of its 15 highlighter colors,
    // paired with the canonical hex it must survive as.
    const wordPalette: [string, string][] = [
      ['yellow', '#ffff00'],
      ['lime', '#00ff00'], // Bright Green
      ['cyan', '#00ffff'],
      ['magenta', '#ff00ff'],
      ['blue', '#0000ff'], // Bright Blue
      ['red', '#ff0000'],
      ['navy', '#000080'], // Dark Blue
      ['teal', '#008080'],
      ['green', '#008000'], // Dark Green
      ['purple', '#800080'], // Dark Violet
      ['maroon', '#800000'], // Dark Red
      ['olive', '#808000'], // Dark Yellow
      ['silver', '#c0c0c0'], // Gray
      ['gray', '#808080'], // Dark Gray
      ['black', '#000000'],
    ]
    for (const [keyword, hex] of wordPalette) {
      expect(
        normalizePastedHighlights(
          `<span style="background:${keyword}">x</span>`,
        ),
      ).toBe(`<span style="background-color: ${hex};">x</span>`)
    }
  })

  it('preserves a Word highlight color given in rgb() form', () => {
    expect(
      normalizePastedHighlights(
        '<span style="background-color: rgb(0, 128, 128);">x</span>',
      ),
    ).toBe('<span style="background-color: #008080;">x</span>')
  })

  it('preserves a black highlight instead of falling back to yellow', () => {
    expect(
      normalizePastedHighlights('<span style="background:black">x</span>'),
    ).toBe('<span style="background-color: #000000;">x</span>')
  })

  it('maps "dark" keyword aliases onto the Word palette values', () => {
    expect(
      normalizePastedHighlights('<span style="background:darkred">x</span>'),
    ).toBe('<span style="background-color: #800000;">x</span>')
    expect(
      normalizePastedHighlights('<span style="background:darkblue">x</span>'),
    ).toBe('<span style="background-color: #000080;">x</span>')
  })

  it('snaps a color outside the Word palette to the nearest Word color', () => {
    // Near-yellow but not an exact Word color → nearest palette swatch.
    expect(
      normalizePastedHighlights(
        '<span style="background-color: #fffe10;">x</span>',
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
    expect(result).toContain('background-color: #ffff00;')
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
