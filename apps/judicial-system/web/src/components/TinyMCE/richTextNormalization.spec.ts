import {
  colorFromHighlightClass,
  findNearestHighlightColor,
  highlightClassFromColor,
  levelFromIndentClass,
  MAX_INDENT_LEVEL,
  normalizeRichTextHtml,
  parseCssColor,
  WORD_HIGHLIGHT_COLORS,
} from './richTextNormalization'

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

describe('highlight class helpers', () => {
  it('round-trips every palette color through its class name', () => {
    for (const { color } of WORD_HIGHLIGHT_COLORS) {
      expect(colorFromHighlightClass(highlightClassFromColor(color))).toBe(
        color,
      )
    }
  })

  it('rejects class names that are not highlight classes', () => {
    expect(colorFromHighlightClass('indent-1')).toBeNull()
    expect(colorFromHighlightClass('hl-xyz')).toBeNull()
    expect(colorFromHighlightClass('hl-ffff000')).toBeNull()
  })
})

describe('indent class helpers', () => {
  it('parses indent classes and caps at the maximum level', () => {
    expect(levelFromIndentClass('indent-1')).toBe(1)
    expect(levelFromIndentClass('indent-3')).toBe(3)
    expect(levelFromIndentClass('indent-99')).toBe(MAX_INDENT_LEVEL)
  })

  it('rejects class names that are not indent classes', () => {
    expect(levelFromIndentClass('hl-ffff00')).toBeNull()
    expect(levelFromIndentClass('indented')).toBeNull()
  })
})

describe('normalizeRichTextHtml', () => {
  describe('highlights', () => {
    it('converts the Word "background" shorthand to a highlight class', () => {
      // Word emits highlights as "background:yellow" — the shorthand, a
      // keyword color — after the paste plugin's Word filter has run.
      expect(
        normalizeRichTextHtml('<span style="background:yellow">x</span>'),
      ).toBe('<span class="hl-ffff00">x</span>')
    })

    it('converts each of the 15 Word highlight colors to its class', () => {
      // The CSS keyword Word emits for each of its 15 highlighter colors,
      // paired with the canonical class it must become.
      const wordPalette: [string, string][] = [
        ['yellow', 'hl-ffff00'],
        ['lime', 'hl-00ff00'], // Bright Green
        ['cyan', 'hl-00ffff'],
        ['magenta', 'hl-ff00ff'],
        ['blue', 'hl-0000ff'], // Bright Blue
        ['red', 'hl-ff0000'],
        ['navy', 'hl-000080'], // Dark Blue
        ['teal', 'hl-008080'],
        ['green', 'hl-008000'], // Dark Green
        ['purple', 'hl-800080'], // Dark Violet
        ['maroon', 'hl-800000'], // Dark Red
        ['olive', 'hl-808000'], // Dark Yellow
        ['silver', 'hl-c0c0c0'], // Gray
        ['gray', 'hl-808080'], // Dark Gray
        ['black', 'hl-000000'],
      ]
      for (const [keyword, className] of wordPalette) {
        expect(
          normalizeRichTextHtml(`<span style="background:${keyword}">x</span>`),
        ).toBe(`<span class="${className}">x</span>`)
      }
    })

    it('converts a legacy inline background-color in rgb() form', () => {
      // Content saved before the switch to classes stored highlights as
      // browser-serialized inline styles.
      expect(
        normalizeRichTextHtml(
          '<span style="background-color: rgb(0, 128, 128);">x</span>',
        ),
      ).toBe('<span class="hl-008080">x</span>')
    })

    it('preserves a black highlight instead of falling back to yellow', () => {
      expect(
        normalizeRichTextHtml('<span style="background:black">x</span>'),
      ).toBe('<span class="hl-000000">x</span>')
    })

    it('maps "dark" keyword aliases onto the Word palette values', () => {
      expect(
        normalizeRichTextHtml('<span style="background:darkred">x</span>'),
      ).toBe('<span class="hl-800000">x</span>')
      expect(
        normalizeRichTextHtml('<span style="background:darkblue">x</span>'),
      ).toBe('<span class="hl-000080">x</span>')
    })

    it('snaps a color outside the Word palette to the nearest Word color', () => {
      expect(
        normalizeRichTextHtml(
          '<span style="background-color: #fffe10;">x</span>',
        ),
      ).toBe('<span class="hl-ffff00">x</span>')
    })

    it('strips transparent and windowtext backgrounds entirely', () => {
      expect(
        normalizeRichTextHtml(
          '<span style="background-color: transparent;">x</span>' +
            '<span style="background:windowtext;">y</span>',
        ),
      ).toBe('xy')
    })

    it('strips a zero-alpha rgba background', () => {
      expect(
        normalizeRichTextHtml(
          '<span style="background-color: rgba(0, 0, 0, 0);">x</span>',
        ),
      ).toBe('x')
    })
  })

  describe('indentation', () => {
    it('converts a one-level Word indent (36pt) to an indent class', () => {
      expect(
        normalizeRichTextHtml('<p style="margin-left:36.0pt;">x</p>'),
      ).toBe('<p class="indent-1">x</p>')
    })

    it('converts a two-level Word indent (72pt) to an indent class', () => {
      expect(
        normalizeRichTextHtml('<p style="margin-left:72.0pt;">x</p>'),
      ).toBe('<p class="indent-2">x</p>')
    })

    it('rounds px margins to the nearest indent step', () => {
      expect(normalizeRichTextHtml('<p style="margin-left: 85px;">x</p>')).toBe(
        '<p class="indent-2">x</p>',
      )
    })

    it('converts a legacy inline padding-left indent', () => {
      // Content saved before the switch to classes stored indentation as
      // padding-left inline styles.
      expect(
        normalizeRichTextHtml('<p style="padding-left: 40px;">x</p>'),
      ).toBe('<p class="indent-1">x</p>')
    })

    it('removes margins smaller than half an indent step', () => {
      expect(normalizeRichTextHtml('<p style="margin-left: 10px;">x</p>')).toBe(
        '<p>x</p>',
      )
    })

    it('caps indentation at the maximum level', () => {
      expect(
        normalizeRichTextHtml('<p style="margin-left: 4000px;">x</p>'),
      ).toBe(`<p class="indent-${MAX_INDENT_LEVEL}">x</p>`)
    })

    it('does not indent inline elements', () => {
      expect(
        normalizeRichTextHtml('<span style="margin-left: 40px;">x</span>'),
      ).toBe('x')
    })
  })

  describe('inline bold and italic', () => {
    it('converts an inline bold style to strong', () => {
      expect(
        normalizeRichTextHtml('<span style="font-weight:bold">x</span>'),
      ).toBe('<strong>x</strong>')
      expect(
        normalizeRichTextHtml('<span style="font-weight:700">x</span>'),
      ).toBe('<strong>x</strong>')
    })

    it('converts an inline italic style to em', () => {
      expect(
        normalizeRichTextHtml('<span style="font-style:italic">x</span>'),
      ).toBe('<em>x</em>')
    })

    it('keeps bold, italic and highlight together', () => {
      expect(
        normalizeRichTextHtml(
          '<span style="font-weight:bold;background:yellow;font-style:italic">x</span>',
        ),
      ).toBe('<span class="hl-ffff00"><em><strong>x</strong></em></span>')
    })
  })

  it('never leaves a style attribute in the output', () => {
    const result = normalizeRichTextHtml(
      '<p style="text-align:center;margin-left:36pt">' +
        '<span style="color:red;font-size:20px">a</span>' +
        '<span style="background:lime">b</span></p>',
    )
    expect(result).not.toContain('style=')
    expect(result).toBe(
      '<p class="indent-1">a<span class="hl-00ff00">b</span></p>',
    )
  })

  it('does not change content without inline styles', () => {
    const html = '<p>plain <strong>bold</strong> text</p>'
    expect(normalizeRichTextHtml(html)).toBe(html)
  })

  it('does not change already-normalized class-based content', () => {
    const html =
      '<p class="indent-1"><span class="hl-ffff00">a</span> and b</p>'
    expect(normalizeRichTextHtml(html)).toBe(html)
  })

  it('is idempotent, so re-pasting editor content is a no-op', () => {
    const once = normalizeRichTextHtml(
      '<p style="margin-left:36pt"><span style="background:lime">a</span> and ' +
        '<span style="background-color: rgb(255, 255, 0);">b</span></p>',
    )
    expect(normalizeRichTextHtml(once)).toBe(once)
  })

  it('returns empty input unchanged', () => {
    expect(normalizeRichTextHtml('')).toBe('')
  })
})
