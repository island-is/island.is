import PDFDocument from 'pdfkit'

import { addNumberedList, addRichText, htmlToBlocks } from './pdfHelpers'

describe('htmlToBlocks', () => {
  it('wraps plain text in a single block', () => {
    const blocks = htmlToBlocks('Hello world')
    expect(blocks).toEqual([
      {
        runs: [
          { text: 'Hello world', bold: false, italic: false, highlight: false },
        ],
        indent: 0,
      },
    ])
  })

  it('parses a simple paragraph', () => {
    const blocks = htmlToBlocks('<p>Hello world</p>')
    expect(blocks).toEqual([
      {
        runs: [
          { text: 'Hello world', bold: false, italic: false, highlight: false },
        ],
        indent: 0,
        softBreak: false,
      },
    ])
  })

  it('produces separate blocks for multiple paragraphs', () => {
    const blocks = htmlToBlocks('<p>First</p><p>Second</p>')
    expect(blocks).toHaveLength(2)
    expect(blocks[0].runs[0].text).toBe('First')
    expect(blocks[1].runs[0].text).toBe('Second')
  })

  it('marks bold runs', () => {
    const blocks = htmlToBlocks('<p><strong>bold</strong></p>')
    expect(blocks[0].runs[0]).toMatchObject({
      text: 'bold',
      bold: true,
      italic: false,
    })
  })

  it('marks italic runs', () => {
    const blocks = htmlToBlocks('<p><em>italic</em></p>')
    expect(blocks[0].runs[0]).toMatchObject({
      text: 'italic',
      bold: false,
      italic: true,
    })
  })

  it('marks bold+italic for nested strong and em', () => {
    const blocks = htmlToBlocks('<p><strong><em>both</em></strong></p>')
    expect(blocks[0].runs[0]).toMatchObject({ bold: true, italic: true })
  })

  it('marks highlight for span with background-color style', () => {
    const blocks = htmlToBlocks(
      '<p><span style="background-color: #ffff00;">highlighted</span></p>',
    )
    expect(blocks[0].runs[0]).toMatchObject({ highlight: '#ffff00' })
  })

  it('does not highlight a span with background-color: transparent', () => {
    // Word paste injects background-color: transparent, which previously
    // rendered as a solid black rectangle in the PDF.
    const blocks = htmlToBlocks(
      '<p><span style="background-color: transparent;">not highlighted</span></p>',
    )
    expect(blocks[0].runs[0]).toMatchObject({
      text: 'not highlighted',
      highlight: false,
    })
  })

  it('does not highlight a span with a fully transparent rgba background', () => {
    const blocks = htmlToBlocks(
      '<p><span style="background-color: rgba(0, 0, 0, 0);">plain</span></p>',
    )
    expect(blocks[0].runs[0]).toMatchObject({ highlight: false })
  })

  it('keeps an opaque rgb highlight whose blue channel is zero', () => {
    // rgb(255, 255, 0) is yellow, not transparent — it must not be mistaken
    // for a zero-alpha rgba value.
    const blocks = htmlToBlocks(
      '<p><span style="background-color: rgb(255, 255, 0);">yellow</span></p>',
    )
    expect(blocks[0].runs[0]).toMatchObject({ highlight: '#ffff00' })
  })

  it('converts an rgb() highlight to hex for PDFKit', () => {
    // Browsers serialize inline styles in rgb() form, but PDFKit's fill()
    // only parses hex and named colors, so the raw rgb() string must not
    // leak through.
    const blocks = htmlToBlocks(
      '<p><span style="background-color: rgb(255, 240, 102);">marked</span></p>',
    )
    expect(blocks[0].runs[0]).toMatchObject({ highlight: '#fff066' })
  })

  it('converts an opaque rgba() highlight to hex for PDFKit', () => {
    const blocks = htmlToBlocks(
      '<p><span style="background-color: rgba(255, 240, 102, 0.99);">marked</span></p>',
    )
    expect(blocks[0].runs[0]).toMatchObject({ highlight: '#fff066' })
  })

  it('zero-pads single-digit channels when converting rgb() to hex', () => {
    const blocks = htmlToBlocks(
      '<p><span style="background-color: rgb(0, 9, 255);">marked</span></p>',
    )
    expect(blocks[0].runs[0]).toMatchObject({ highlight: '#0009ff' })
  })

  it('keeps a hex highlight unchanged', () => {
    const blocks = htmlToBlocks(
      '<p><span style="background-color: #fff066;">marked</span></p>',
    )
    expect(blocks[0].runs[0]).toMatchObject({ highlight: '#fff066' })
  })

  it('marks highlight for a span with a hl-xxxxxx class', () => {
    // The editor stores highlights as classes — inline styles are blocked by
    // the WAF in front of the API.
    const blocks = htmlToBlocks(
      '<p><span class="hl-ffff00">highlighted</span></p>',
    )
    expect(blocks[0].runs[0]).toMatchObject({ highlight: '#ffff00' })
  })

  it('finds the highlight class among other classes', () => {
    const blocks = htmlToBlocks(
      '<p><span class="other hl-008080 more">marked</span></p>',
    )
    expect(blocks[0].runs[0]).toMatchObject({ highlight: '#008080' })
  })

  it('does not highlight a span with an unrelated class', () => {
    const blocks = htmlToBlocks('<p><span class="fancy">plain</span></p>')
    expect(blocks[0].runs[0]).toMatchObject({
      text: 'plain',
      highlight: false,
    })
  })

  it('produces multiple runs within one paragraph', () => {
    const blocks = htmlToBlocks('<p>normal <strong>bold</strong> end</p>')
    expect(blocks[0].runs).toHaveLength(3)
    expect(blocks[0].runs[0]).toMatchObject({ text: 'normal ', bold: false })
    expect(blocks[0].runs[1]).toMatchObject({ text: 'bold', bold: true })
    expect(blocks[0].runs[2]).toMatchObject({ text: ' end', bold: false })
  })

  it('converts padding-left style to indent in points', () => {
    const blocks = htmlToBlocks('<p style="padding-left: 40px;">indented</p>')
    expect(blocks[0].indent).toBe(30)
  })

  it('converts an indent-N class to indent in points', () => {
    // The editor stores indentation as classes — inline styles are blocked by
    // the WAF in front of the API.
    expect(htmlToBlocks('<p class="indent-1">x</p>')[0].indent).toBe(30)
    expect(htmlToBlocks('<p class="indent-3">x</p>')[0].indent).toBe(90)
  })

  it('applies an indent-N class on other block tags to nested content', () => {
    // The editor's content CSS indents any element carrying the class, not
    // just paragraphs, so div/li/blockquote must indent here too.
    expect(htmlToBlocks('<div class="indent-2">x</div>')[0].indent).toBe(60)
    expect(
      htmlToBlocks('<blockquote class="indent-1"><p>x</p></blockquote>')[0]
        .indent,
    ).toBe(30)
    expect(
      htmlToBlocks(
        '<ul><li class="indent-1"><p class="indent-1">x</p></li></ul>',
      )[0].indent,
    ).toBe(60)
  })

  it('caps a class-based indent at the maximum level', () => {
    const blocks = htmlToBlocks('<p class="indent-99">x</p>')
    expect(blocks[0].indent).toBe(300)
  })

  it('emits an empty block for an empty paragraph', () => {
    const blocks = htmlToBlocks('<p></p>')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].runs).toHaveLength(0)
  })

  it('splits into separate blocks at <br>', () => {
    const blocks = htmlToBlocks('<p>line1<br>line2</p>')
    expect(blocks).toHaveLength(2)
    expect(blocks[0].runs[0].text).toBe('line1')
    expect(blocks[0].softBreak).toBe(true)
    expect(blocks[1].runs[0].text).toBe('line2')
    expect(blocks[1].softBreak).toBeFalsy()
  })

  describe('malformed HTML', () => {
    it('captures text from an unclosed tag', () => {
      const blocks = htmlToBlocks('<p>Hello')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].runs[0].text).toBe('Hello')
    })

    it('captures bold run from mismatched closing tags', () => {
      const blocks = htmlToBlocks('<p><strong>bold</p>')
      expect(blocks[0].runs[0]).toMatchObject({ text: 'bold', bold: true })
    })
  })

  describe('unsupported tags', () => {
    it('strips <div> wrapper and processes child paragraph normally', () => {
      const blocks = htmlToBlocks('<div><p>text</p></div>')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].runs[0].text).toBe('text')
    })

    it('does not emit literal tag names as run text for <script>', () => {
      const blocks = htmlToBlocks('<script>alert("xss")</script>')
      const allText = blocks.flatMap((b) => b.runs.map((r) => r.text)).join('')
      expect(allText).not.toContain('<script>')
      expect(allText).not.toContain('</script>')
    })

    it('does not emit literal tag names as run text for <style>', () => {
      const blocks = htmlToBlocks('<style>body { color: red; }</style>')
      const allText = blocks.flatMap((b) => b.runs.map((r) => r.text)).join('')
      expect(allText).not.toContain('<style>')
      expect(allText).not.toContain('</style>')
    })
  })

  describe('lists', () => {
    it('marks unordered list items with a bullet and indents them', () => {
      const blocks = htmlToBlocks('<ul><li>item one</li><li>item two</li></ul>')
      expect(blocks).toHaveLength(2)
      expect(blocks[0]).toMatchObject({ marker: '•', indent: 30 })
      expect(blocks[0].runs[0].text).toBe('item one')
      expect(blocks[1]).toMatchObject({ marker: '•', indent: 30 })
      expect(blocks[1].runs[0].text).toBe('item two')
    })

    it('numbers ordered list items', () => {
      const blocks = htmlToBlocks('<ol><li>first</li><li>second</li></ol>')
      expect(blocks.map((b) => b.marker)).toEqual(['1.', '2.'])
      expect(blocks.map((b) => b.runs[0].text)).toEqual(['first', 'second'])
    })

    it('honours the start attribute on an ordered list', () => {
      const blocks = htmlToBlocks('<ol start="3"><li>a</li><li>b</li></ol>')
      expect(blocks.map((b) => b.marker)).toEqual(['3.', '4.'])
    })

    it('keeps inline formatting inside a list item on the same block', () => {
      const blocks = htmlToBlocks(
        '<ul><li>plain <strong>bold</strong> tail</li></ul>',
      )
      expect(blocks).toHaveLength(1)
      expect(blocks[0].marker).toBe('•')
      expect(blocks[0].runs).toEqual([
        { text: 'plain ', bold: false, italic: false, highlight: false },
        { text: 'bold', bold: true, italic: false, highlight: false },
        { text: ' tail', bold: false, italic: false, highlight: false },
      ])
    })

    it('keeps highlights inside a list item', () => {
      const blocks = htmlToBlocks(
        '<ul><li><span class="hl-ffff00">marked</span></li></ul>',
      )
      expect(blocks[0].runs[0]).toMatchObject({
        text: 'marked',
        highlight: '#ffff00',
      })
    })

    it('indents nested lists one level deeper', () => {
      const blocks = htmlToBlocks(
        '<ul><li>outer<ul><li>inner</li></ul></li></ul>',
      )
      expect(blocks).toHaveLength(2)
      expect(blocks[0]).toMatchObject({ marker: '•', indent: 30 })
      expect(blocks[0].runs[0].text).toBe('outer')
      expect(blocks[1]).toMatchObject({ marker: '•', indent: 60 })
      expect(blocks[1].runs[0].text).toBe('inner')
    })

    it('indents a list nested directly inside a list', () => {
      const blocks = htmlToBlocks('<ul><li>outer</li><ul><li>inner</li></ul>')
      expect(blocks[1]).toMatchObject({ marker: '•', indent: 60 })
      expect(blocks[1].runs[0].text).toBe('inner')
    })

    it('draws no marker for an item wrapping only a nested list', () => {
      // The editor builds such a wrapper when an item is indented past the
      // nesting available to it, and renders it without a marker of its own.
      const blocks = htmlToBlocks('<ul><li><ul><li>inner</li></ul></li></ul>')
      expect(blocks).toHaveLength(1)
      expect(blocks[0]).toMatchObject({ marker: '\u2022', indent: 60 })
      expect(blocks[0].runs[0].text).toBe('inner')
    })

    it('keeps nested ordered numbering when the parent item has no text', () => {
      const blocks = htmlToBlocks(
        '<ul><li><ol start="3"><li>inner</li><li>next</li></ol></li></ul>',
      )
      expect(blocks).toHaveLength(2)
      expect(blocks[0]).toMatchObject({ marker: '3.', indent: 60 })
      expect(blocks[0].runs[0].text).toBe('inner')
      expect(blocks[1]).toMatchObject({ marker: '4.', indent: 60 })
    })

    it('draws one marker per item when an item is indented twice', () => {
      // Exactly what the editor produces for "a / b / c" with b indented
      // twice: b's item is reached through a marker-less wrapper.
      const blocks = htmlToBlocks(
        '<ul><li>a<ul><li style="list-style-type: none;">' +
          '<ul><li>b</li></ul></li></ul></li><li>c</li></ul>',
      )
      expect(
        blocks.map((b) => [
          b.marker,
          b.indent,
          b.runs.map((r) => r.text).join(''),
        ]),
      ).toEqual([
        ['\u2022', 30, 'a'],
        ['\u2022', 90, 'b'],
        ['\u2022', 30, 'c'],
      ])
    })

    it('puts the marker on the first line of a paragraph-wrapped item', () => {
      const blocks = htmlToBlocks('<ul><li><p>wrapped</p></li></ul>')
      expect(blocks).toHaveLength(1)
      expect(blocks[0]).toMatchObject({ marker: '•', indent: 30 })
      expect(blocks[0].runs[0].text).toBe('wrapped')
    })

    it('splits a list item on <br> and marks only its first line', () => {
      const blocks = htmlToBlocks('<ul><li>one<br>two</li></ul>')
      expect(blocks).toHaveLength(2)
      expect(blocks[0]).toMatchObject({ marker: '•', softBreak: true })
      expect(blocks[1].marker).toBeUndefined()
      expect(blocks[1].runs[0].text).toBe('two')
    })

    it('carries an indent class on the list onto its items', () => {
      const blocks = htmlToBlocks('<ul class="indent-1"><li>x</li></ul>')
      expect(blocks[0].indent).toBe(60)
    })

    it('keeps an empty list item as a marker-only block', () => {
      const blocks = htmlToBlocks('<ul><li></li><li>after</li></ul>')
      expect(blocks).toHaveLength(2)
      expect(blocks[0]).toMatchObject({ marker: '•', runs: [] })
      expect(blocks[1].runs[0].text).toBe('after')
    })
  })

  describe('empty and whitespace-only content', () => {
    it('returns no blocks for empty string input', () => {
      const blocks = htmlToBlocks('')
      expect(blocks).toHaveLength(0)
    })

    it('collapses a whitespace-only paragraph to an empty block', () => {
      const blocks = htmlToBlocks('<p>   </p>')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].runs).toHaveLength(0)
    })
  })

  describe('whitespace collapsing', () => {
    it('drops leading empty spacer spans from a Word paste', () => {
      // Word injects empty <span> </span> spacers that the editor hides but
      // previously rendered as literal leading spaces in the PDF.
      const blocks = htmlToBlocks(
        '<p><span style="font-weight: 400;"> </span>' +
          '<span style="font-weight: 400;"> </span>' +
          '<span style="font-weight: 400;">Texti.</span></p>',
      )
      expect(blocks[0].runs).toHaveLength(1)
      expect(blocks[0].runs[0].text).toBe('Texti.')
    })

    it('collapses internal runs of whitespace to a single space', () => {
      const blocks = htmlToBlocks('<p>a    b</p>')
      expect(blocks[0].runs[0].text).toBe('a b')
    })

    it('trims trailing whitespace from a paragraph', () => {
      const blocks = htmlToBlocks('<p>text   </p>')
      expect(blocks[0].runs[0].text).toBe('text')
    })

    it('keeps a single space between adjacent formatted runs', () => {
      const blocks = htmlToBlocks('<p>normal <strong>bold</strong> end</p>')
      expect(blocks[0].runs.map((r) => r.text)).toEqual([
        'normal ',
        'bold',
        ' end',
      ])
    })
  })

  describe('tables', () => {
    it('parses an editor-shaped table into a table block', () => {
      const blocks = htmlToBlocks(
        '<table><tbody>' +
          '<tr><td><p>a</p></td><td><p>b</p></td></tr>' +
          '<tr><td><p>c</p></td><td><p>d</p></td></tr>' +
          '</tbody></table>',
      )
      expect(blocks).toHaveLength(1)
      expect(blocks[0].runs).toEqual([])
      expect(blocks[0].indent).toBe(0)
      const rows = blocks[0].table?.rows
      expect(rows).toHaveLength(2)
      expect(rows?.[0].cells).toHaveLength(2)
      expect(rows?.[0].cells[0].blocks[0].runs[0].text).toBe('a')
      expect(rows?.[0].cells[1].blocks[0].runs[0].text).toBe('b')
      expect(rows?.[1].cells[1].blocks[0].runs[0].text).toBe('d')
    })

    it('parses tr directly under table, without a tbody', () => {
      // htmlparser2 does no tree construction, so legacy content may reach
      // the parser without the tbody a browser would synthesize.
      const blocks = htmlToBlocks(
        '<table><tr><td><p>a</p></td></tr><tr><td><p>b</p></td></tr></table>',
      )
      expect(blocks[0].table?.rows).toHaveLength(2)
      expect(blocks[0].table?.rows[0].cells[0].blocks[0].runs[0].text).toBe('a')
    })

    it('parses th like td, without forcing bold', () => {
      const blocks = htmlToBlocks(
        '<table><thead><tr><th><p>h</p></th></tr></thead>' +
          '<tbody><tr><td><p>a</p></td></tr></tbody></table>',
      )
      const rows = blocks[0].table?.rows
      expect(rows).toHaveLength(2)
      expect(rows?.[0].cells[0].blocks[0].runs[0]).toMatchObject({
        text: 'h',
        bold: false,
      })
    })

    it('keeps marks and classes on cell content', () => {
      const blocks = htmlToBlocks(
        '<table><tbody><tr><td>' +
          '<p><strong>bold</strong> <span class="hl-ffff00">lit</span></p>' +
          '<p class="indent-1">inn</p>' +
          '</td></tr></tbody></table>',
      )
      const cellBlocks = blocks[0].table?.rows[0].cells[0].blocks
      expect(cellBlocks).toHaveLength(2)
      expect(cellBlocks?.[0].runs.map((r) => r.text)).toEqual([
        'bold',
        ' ',
        'lit',
      ])
      expect(cellBlocks?.[0].runs[0].bold).toBe(true)
      expect(cellBlocks?.[0].runs[2].highlight).toBe('#ffff00')
      expect(cellBlocks?.[1].indent).toBe(30)
    })

    it('splits cell paragraphs and hard breaks into blocks', () => {
      const blocks = htmlToBlocks(
        '<table><tbody><tr><td><p>one<br>two</p><p>three</p></td></tr></tbody></table>',
      )
      const cellBlocks = blocks[0].table?.rows[0].cells[0].blocks
      expect(cellBlocks?.map((b) => b.runs[0]?.text)).toEqual([
        'one',
        'two',
        'three',
      ])
      expect(cellBlocks?.[0].softBreak).toBe(true)
      expect(cellBlocks?.[1].softBreak).toBe(false)
    })

    it('collapses whitespace inside cells and ignores it between rows', () => {
      const blocks = htmlToBlocks(
        '<table>\n <tbody>\n  <tr>\n   <td><p>a    b</p></td>\n  </tr>\n </tbody>\n</table>',
      )
      expect(blocks).toHaveLength(1)
      expect(blocks[0].table?.rows).toHaveLength(1)
      expect(blocks[0].table?.rows[0].cells[0].blocks[0].runs[0].text).toBe(
        'a b',
      )
    })

    it('parses lists inside a cell as marker blocks', () => {
      const blocks = htmlToBlocks(
        '<table><tbody><tr><td><ul><li><p>a</p></li><li><p>b</p></li></ul></td></tr></tbody></table>',
      )
      const cellBlocks = blocks[0].table?.rows[0].cells[0].blocks
      expect(cellBlocks).toHaveLength(2)
      expect(cellBlocks?.[0]).toMatchObject({ marker: '•', indent: 30 })
      expect(cellBlocks?.[0].runs[0].text).toBe('a')
    })

    it('tolerates ragged rows and ignores colspan/rowspan', () => {
      const blocks = htmlToBlocks(
        '<table><tbody>' +
          '<tr><td colspan="2"><p>a</p></td></tr>' +
          '<tr><td rowspan="2"><p>b</p></td><td><p>c</p></td></tr>' +
          '</tbody></table>',
      )
      const rows = blocks[0].table?.rows
      expect(rows?.[0].cells).toHaveLength(1)
      expect(rows?.[1].cells).toHaveLength(2)
    })

    it('keeps a nested table as a block inside its host cell', () => {
      const blocks = htmlToBlocks(
        '<table><tbody><tr><td><p>outer</p>' +
          '<table><tbody><tr><td><p>inner</p></td></tr></tbody></table>' +
          '</td></tr></tbody></table>',
      )
      const cellBlocks = blocks[0].table?.rows[0].cells[0].blocks
      expect(cellBlocks?.[0].runs[0].text).toBe('outer')
      expect(
        cellBlocks?.[1].table?.rows[0].cells[0].blocks[0].runs[0].text,
      ).toBe('inner')
    })

    it('produces no block for an empty table', () => {
      expect(htmlToBlocks('<table></table>')).toEqual([])
      expect(htmlToBlocks('<table><tbody><tr></tr></tbody></table>')).toEqual(
        [],
      )
    })

    it('indents a table nested in an indented container', () => {
      const blocks = htmlToBlocks(
        '<div class="indent-1"><table><tbody><tr><td><p>a</p></td></tr></tbody></table></div>',
      )
      expect(blocks[0].indent).toBe(30)
      expect(blocks[0].table?.rows).toHaveLength(1)
    })
  })
})

describe('addRichText layout', () => {
  interface Rect {
    x: number
    y: number
    w: number
    h: number
    page: number
    // How the rect was painted: highlight rects fill, table borders stroke.
    kind?: 'fill' | 'stroke'
  }
  interface Frag {
    text: string
    x: number
    y: number
    page: number
  }

  // Mirrors the document setup in indictmentCourtRecordPdf.ts, instrumented to
  // record where highlight rects are filled and where text fragments are
  // actually laid out by PDFKit, so the two can be compared geometrically.
  const createInstrumentedDoc = () => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 70, bottom: 70, left: 70, right: 70 },
      bufferPages: true,
    })
    doc.lineGap(2)
    doc.font('Times-Roman').fontSize(11)

    const rects: Rect[] = []
    const frags: Frag[] = []
    const currentPage = () => doc.bufferedPageRange().count

    let lastRect: Rect | undefined
    const originalRect = doc.rect.bind(doc)
    doc.rect = (x: number, y: number, w: number, h: number) => {
      const rect: Rect = { x, y, w, h, page: currentPage() }
      rects.push(rect)
      lastRect = rect
      return originalRect(x, y, w, h)
    }

    // The paint call that follows a rect tells highlight fills and table
    // border strokes apart.
    const tagLastRect = (kind: 'fill' | 'stroke') => {
      if (lastRect && !lastRect.kind) {
        lastRect.kind = kind
      }
    }
    const originalFill = doc.fill.bind(doc)
    doc.fill = (color?: unknown) => {
      tagLastRect('fill')
      return originalFill(color as PDFKit.Mixins.ColorValue)
    }
    const originalStroke = doc.stroke.bind(doc)
    doc.stroke = (color?: unknown) => {
      tagLastRect('stroke')
      return color === undefined
        ? originalStroke()
        : originalStroke(color as PDFKit.Mixins.ColorValue)
    }

    const docInternals = (doc as unknown) as {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _fragment: (text: string, x: number, y: number, options: unknown) => void
    }
    const originalFragment = docInternals._fragment.bind(doc)
    docInternals._fragment = (
      text: string,
      x: number,
      y: number,
      options: unknown,
    ) => {
      frags.push({ text: `${text}`, x, y, page: currentPage() })
      return originalFragment(text, x, y, options)
    }

    return { doc, rects, frags }
  }

  const findFragmentWith = (frags: Frag[], needle: string): Frag => {
    const frag = frags.find((f) => f.text.includes(needle))
    expect(frag).toBeDefined()
    return frag as Frag
  }

  // The rect is drawn slightly above the line's text origin (descender
  // compensation), so allow a few points of slack when comparing.
  const Y_TOLERANCE = 5

  it('draws the rect on the text when the highlight starts the paragraph', () => {
    const { doc, rects, frags } = createInstrumentedDoc()

    addRichText(
      doc,
      '<p><span style="background-color: #FFF066;">MARKER</span> trailing text</p>',
      2,
    )

    const frag = findFragmentWith(frags, 'MARKER')
    expect(rects).toHaveLength(1)
    expect(Math.abs(rects[0].x - frag.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(rects[0].y - frag.y)).toBeLessThanOrEqual(Y_TOLERANCE)
    doc.end()
  })

  it('draws the rect on the correct line when preceding text wraps', () => {
    const { doc, rects, frags } = createInstrumentedDoc()

    // ~40 words of plain text guarantee at least one wrapped line before the
    // highlighted word, which must end up on the same line as its rect.
    const filler = 'orðalengja '.repeat(40).trim()
    addRichText(
      doc,
      `<p>${filler} <span style="background-color: #FFF066;">MARKER</span></p>`,
      2,
    )

    const frag = findFragmentWith(frags, 'MARKER')
    expect(rects).toHaveLength(1)
    const rect = rects[0]

    // Vertical: the rect must sit on the highlighted word's line, not line 1.
    expect(Math.abs(rect.y - frag.y)).toBeLessThanOrEqual(Y_TOLERANCE)

    // Horizontal: the rect must start where the word starts and stay on the
    // page (the old accumulation placed it beyond the right margin).
    const markerX = frag.x + doc.widthOfString(frag.text.split('MARKER')[0])
    expect(Math.abs(rect.x - markerX)).toBeLessThanOrEqual(2)
    expect(rect.x + rect.w).toBeLessThanOrEqual(
      doc.page.width - doc.page.margins.right + 2,
    )
    doc.end()
  })

  it('draws one rect per laid-out line when a highlight wraps', () => {
    const { doc, rects, frags } = createInstrumentedDoc()

    const highlighted = 'gulmerking '.repeat(40).trim()
    addRichText(
      doc,
      `<p><span style="background-color: #FFF066;">${highlighted}</span></p>`,
      2,
    )

    const highlightFrags = frags.filter((f) => f.text.includes('gulmerking'))
    const fragYs = [...new Set(highlightFrags.map((f) => Math.round(f.y)))]
    expect(fragYs.length).toBeGreaterThan(1)
    // One rect per laid-out line of highlighted text.
    expect(rects.length).toBe(fragYs.length)

    for (const rect of rects) {
      expect(
        fragYs.some((y) => Math.abs(rect.y - y) <= Y_TOLERANCE),
      ).toBeTruthy()
    }
    doc.end()
  })

  it('restores the default font after a block ending in a formatted run', () => {
    const { doc } = createInstrumentedDoc()

    addRichText(doc, '<p>plain <strong>bold</strong></p>', 2)

    // The document font must not be left on Times-Bold, or subsequent text
    // added without an explicit font would render bold.
    const font = ((doc as unknown) as { _font: { name: string } })._font
    expect(font.name).toBe('Times-Roman')
    doc.end()
  })

  it('keeps rect and text together when the block moves to a new page', () => {
    const { doc, rects, frags } = createInstrumentedDoc()

    // Park the cursor so close to the bottom margin that the first line no
    // longer fits; PDFKit moves the text to a new page and the rect must
    // follow it.
    doc.y = doc.page.height - doc.page.margins.bottom - 5
    addRichText(
      doc,
      '<p><span style="background-color: #FFF066;">MARKER</span></p>',
      2,
    )

    const frag = findFragmentWith(frags, 'MARKER')
    expect(rects).toHaveLength(1)
    expect(rects[0].page).toBe(frag.page)
    expect(Math.abs(rects[0].y - frag.y)).toBeLessThanOrEqual(Y_TOLERANCE)
    doc.end()
  })

  it('draws a bullet in the gutter beside each list item', () => {
    const { doc, frags } = createInstrumentedDoc()

    addRichText(doc, '<ul><li>fyrsta</li><li>annað</li></ul>', 2)

    const bullets = frags.filter((f) => f.text.includes('•'))
    expect(bullets).toHaveLength(2)

    const first = findFragmentWith(frags, 'fyrsta')
    const second = findFragmentWith(frags, 'annað')

    // The marker shares the item's first line and sits left of its text, but
    // never spills outside the page margin.
    expect(bullets[0].y).toBe(first.y)
    expect(bullets[1].y).toBe(second.y)
    for (const [i, item] of [first, second].entries()) {
      expect(bullets[i].x).toBeLessThan(item.x)
      expect(bullets[i].x).toBeGreaterThanOrEqual(doc.page.margins.left)
    }

    // Item text is indented one list level past the margin.
    expect(first.x).toBe(doc.page.margins.left + 30)
    doc.end()
  })

  it('draws the number of each ordered list item', () => {
    const { doc, frags } = createInstrumentedDoc()

    addRichText(doc, '<ol><li>eitt</li><li>tvö</li></ol>', 2)

    expect(frags.filter((f) => f.text.includes('1.'))).toHaveLength(1)
    expect(frags.filter((f) => f.text.includes('2.'))).toHaveLength(1)
    doc.end()
  })

  it('draws the bullet only once when a list item wraps', () => {
    const { doc, frags } = createInstrumentedDoc()

    const long = 'orðalengja '.repeat(40).trim()
    addRichText(doc, `<ul><li>${long}</li></ul>`, 2)

    expect(frags.filter((f) => f.text.includes('•'))).toHaveLength(1)
    const lineYs = [
      ...new Set(
        frags
          .filter((f) => f.text.includes('orðalengja'))
          .map((f) => Math.round(f.y)),
      ),
    ]
    expect(lineYs.length).toBeGreaterThan(1)
    doc.end()
  })

  it('keeps the bullet on the same page as its item', () => {
    const { doc, frags } = createInstrumentedDoc()

    doc.y = doc.page.height - doc.page.margins.bottom - 5
    addRichText(doc, '<ul><li>atriði</li></ul>', 2)

    const bullet = findFragmentWith(frags, '•')
    const item = findFragmentWith(frags, 'atriði')
    expect(bullet.page).toBe(item.page)
    expect(bullet.y).toBe(item.y)
    doc.end()
  })

  it('indents a nested list one level deeper than its parent', () => {
    const { doc, frags } = createInstrumentedDoc()

    addRichText(doc, '<ul><li>ytra<ul><li>innra</li></ul></li></ul>', 2)

    const outer = findFragmentWith(frags, 'ytra')
    const inner = findFragmentWith(frags, 'innra')
    expect(inner.x - outer.x).toBe(30)
    doc.end()
  })

  describe('justified alignment', () => {
    // Where the trimmed text of the line's rightmost fragment ends.
    const lineEnd = (doc: typeof PDFDocument.prototype, line: Frag[]) => {
      const last = line.reduce((a, b) => (a.x > b.x ? a : b), line[0])
      return last.x + doc.widthOfString(last.text.trimEnd())
    }

    const fragsByLine = (frags: Frag[]) => {
      const ys = [...new Set(frags.map((f) => Math.round(f.y)))].sort(
        (a, b) => a - b,
      )
      return ys.map((y) => frags.filter((f) => Math.round(f.y) === y))
    }

    it('stretches every wrapped line to the right margin, but not the last', () => {
      const { doc, frags } = createInstrumentedDoc()

      const filler = 'orðalengja stutt já langlokusamsetningarorð '
        .repeat(12)
        .trim()
      addRichText(doc, `<p>${filler}</p>`, 2, 11, 'justify')

      doc.font('Times-Roman').fontSize(11)
      const edge = doc.page.width - doc.page.margins.right
      const lines = fragsByLine(frags)
      expect(lines.length).toBeGreaterThan(2)

      for (const line of lines.slice(0, -1)) {
        expect(Math.abs(lineEnd(doc, line) - edge)).toBeLessThanOrEqual(0.5)
      }
      // The block's last line keeps its natural width.
      expect(lineEnd(doc, lines[lines.length - 1])).toBeLessThan(edge - 1)
      doc.end()
    })

    it('does not stretch lines unless justify is requested', () => {
      const { doc, frags } = createInstrumentedDoc()

      const filler = 'orðalengja stutt já langlokusamsetningarorð '
        .repeat(12)
        .trim()
      addRichText(doc, `<p>${filler}</p>`, 2)

      // Every word on the first line sits at its natural cumulative position.
      doc.font('Times-Roman').fontSize(11)
      const [firstLine] = fragsByLine(frags)
      const sorted = [...firstLine].sort((a, b) => a.x - b.x)
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(
          Math.abs(
            sorted[i + 1].x - sorted[i].x - doc.widthOfString(sorted[i].text),
          ),
        ).toBeLessThanOrEqual(0.01)
      }
      doc.end()
    })

    it('does not stretch a line ended by a hard break', () => {
      const { doc, frags } = createInstrumentedDoc()

      addRichText(doc, '<p>stutt brot<br>framhald texta</p>', 2, 11, 'justify')

      const first = findFragmentWith(frags, 'stutt')
      const second = findFragmentWith(frags, 'brot')
      doc.font('Times-Roman').fontSize(11)
      expect(
        Math.abs(second.x - first.x - doc.widthOfString(first.text)),
      ).toBeLessThanOrEqual(0.01)
      doc.end()
    })

    it('keeps the highlight rect glued to text across a widened gap', () => {
      const { doc, rects, frags } = createInstrumentedDoc()

      const filler = 'orðalengja '.repeat(30).trim()
      addRichText(
        doc,
        `<p><span style="background-color: #FFF066;">MERKT ORÐ</span> ${filler}</p>`,
        2,
        11,
        'justify',
      )

      const merkt = findFragmentWith(frags, 'MERKT')
      const ord = findFragmentWith(frags, 'ORÐ')
      doc.font('Times-Roman').fontSize(11)

      // The gap inside the highlight was widened by justification...
      expect(ord.x - merkt.x).toBeGreaterThan(doc.widthOfString(merkt.text))

      // ...and the single rect still spans exactly from the first glyph to the
      // last (1pt of horizontal padding on each side).
      expect(rects.length).toBeGreaterThanOrEqual(1)
      const rect = rects[0]
      expect(Math.abs(rect.x - (merkt.x - 1))).toBeLessThanOrEqual(0.5)
      expect(
        Math.abs(rect.x + rect.w - (ord.x + doc.widthOfString('ORÐ') + 1)),
      ).toBeLessThanOrEqual(0.5)
      doc.end()
    })

    it('handles a chopped over-long token without gaps to stretch', () => {
      const { doc, frags } = createInstrumentedDoc()

      addRichText(doc, `<p>${'x'.repeat(300)} lok</p>`, 2, 11, 'justify')

      expect(frags.length).toBeGreaterThan(1)
      for (const frag of frags) {
        expect(Number.isFinite(frag.x)).toBe(true)
      }
      doc.end()
    })
  })

  describe('tables', () => {
    const strokes = (rects: Rect[]) => rects.filter((r) => r.kind === 'stroke')
    const fills = (rects: Rect[]) => rects.filter((r) => r.kind === 'fill')

    // A4 with the 70pt margins the instrumented doc uses.
    const CONTENT_LEFT = 70
    const CONTENT_WIDTH = 595.28 - 140
    const CELL_PADDING = 5

    it('draws equal-width bordered cells with padded content', () => {
      const { doc, rects, frags } = createInstrumentedDoc()

      addRichText(
        doc,
        '<table><tbody>' +
          '<tr><td><p>a</p></td><td><p>b</p></td></tr>' +
          '<tr><td><p>c</p></td><td><p>d</p></td></tr>' +
          '</tbody></table>',
        2,
      )

      const borders = strokes(rects)
      expect(borders).toHaveLength(4)

      const columnWidth = CONTENT_WIDTH / 2
      for (const border of borders) {
        expect(Math.abs(border.w - columnWidth)).toBeLessThanOrEqual(0.01)
      }
      const xs = [...new Set(borders.map((r) => Math.round(r.x)))].sort(
        (a, b) => a - b,
      )
      expect(xs).toEqual([CONTENT_LEFT, Math.round(CONTENT_LEFT + columnWidth)])

      // Second-column text starts one cell padding inside its column.
      const fragB = findFragmentWith(frags, 'b')
      expect(
        Math.abs(fragB.x - (CONTENT_LEFT + columnWidth + CELL_PADDING)),
      ).toBeLessThanOrEqual(0.01)

      // First-row text sits one cell padding below the row top.
      const rowTop = Math.min(...borders.map((r) => r.y))
      const fragA = findFragmentWith(frags, 'a')
      expect(Math.abs(fragA.y - (rowTop + CELL_PADDING))).toBeLessThanOrEqual(
        Y_TOLERANCE,
      )
      doc.end()
    })

    it('sizes a row to its tallest cell', () => {
      const { doc, rects } = createInstrumentedDoc()

      addRichText(
        doc,
        `<table><tbody><tr><td><p>${'orð '.repeat(60)}</p></td>` +
          '<td><p>stutt</p></td></tr></tbody></table>',
        2,
      )

      const borders = strokes(rects)
      expect(borders).toHaveLength(2)
      // Both cells share the wrapped cell's height, well beyond one line.
      expect(Math.abs(borders[0].h - borders[1].h)).toBeLessThanOrEqual(0.01)
      expect(borders[0].h).toBeGreaterThan(40)
      doc.end()
    })

    it('moves a row that no longer fits to the next page in one piece', () => {
      const { doc, rects, frags } = createInstrumentedDoc()

      doc.y = doc.page.height - doc.page.margins.bottom - 20
      addRichText(
        doc,
        '<table><tbody><tr><td><p>fyrsta lína<br>önnur lína<br>þriðja lína</p></td></tr></tbody></table>',
        2,
      )

      const borders = strokes(rects)
      expect(borders).toHaveLength(1)
      expect(borders[0].page).toBe(2)
      expect(borders[0].y).toBe(70)
      expect(findFragmentWith(frags, 'fyrsta').page).toBe(2)
      expect(findFragmentWith(frags, 'þriðja').page).toBe(2)
      doc.end()
    })

    it('splits a row taller than a page at line boundaries', () => {
      const { doc, rects, frags } = createInstrumentedDoc()

      const paragraphs = Array.from(
        { length: 60 },
        (_, i) => `<p>efni${i}</p>`,
      ).join('')
      addRichText(
        doc,
        `<table><tbody><tr><td>${paragraphs}</td></tr></tbody></table>`,
        2,
      )

      const borders = strokes(rects)
      expect(borders.length).toBeGreaterThanOrEqual(2)
      expect(new Set(borders.map((r) => r.page)).size).toBeGreaterThanOrEqual(2)
      expect(findFragmentWith(frags, 'efni0').page).toBe(1)
      expect(findFragmentWith(frags, 'efni59').page).toBeGreaterThan(1)
      doc.end()
    })

    it('keeps a highlight rect inside its cell, on its text', () => {
      const { doc, rects, frags } = createInstrumentedDoc()

      addRichText(
        doc,
        '<table><tbody><tr>' +
          '<td><p><span class="hl-ffff00">merkt</span></p></td>' +
          '<td><p>b</p></td>' +
          '</tr></tbody></table>',
        2,
      )

      const highlights = fills(rects)
      expect(highlights).toHaveLength(1)
      const frag = findFragmentWith(frags, 'merkt')
      expect(Math.abs(highlights[0].x - frag.x)).toBeLessThanOrEqual(2)
      expect(Math.abs(highlights[0].y - frag.y)).toBeLessThanOrEqual(
        Y_TOLERANCE,
      )

      const cellBorder = strokes(rects)[0]
      expect(highlights[0].x).toBeGreaterThanOrEqual(cellBorder.x)
      expect(highlights[0].x + highlights[0].w).toBeLessThanOrEqual(
        cellBorder.x + cellBorder.w,
      )
      doc.end()
    })

    it('lays out a list inside a cell with its marker in the cell', () => {
      const { doc, rects, frags } = createInstrumentedDoc()

      addRichText(
        doc,
        '<table><tbody><tr>' +
          '<td><ul><li><p>fyrsti</p></li></ul></td><td><p>b</p></td>' +
          '</tr></tbody></table>',
        2,
      )

      const cellBorder = strokes(rects)[0]
      const marker = findFragmentWith(frags, '•')
      const item = findFragmentWith(frags, 'fyrsti')
      expect(marker.x).toBeGreaterThanOrEqual(cellBorder.x)
      expect(item.x).toBeGreaterThan(marker.x)
      expect(item.x + 1).toBeLessThanOrEqual(cellBorder.x + cellBorder.w)
      doc.end()
    })

    it('resumes normal flow at the margin below the table', () => {
      const { doc, rects, frags } = createInstrumentedDoc()

      addRichText(
        doc,
        '<table><tbody><tr><td><p>a</p></td></tr></tbody></table><p>eftir</p>',
        2,
      )

      const border = strokes(rects)[0]
      const frag = findFragmentWith(frags, 'eftir')
      expect(frag.x).toBe(CONTENT_LEFT)
      expect(frag.y).toBeGreaterThan(border.y + border.h)
      doc.end()
    })
  })
})

describe('addNumberedList', () => {
  interface Frag {
    text: string
    x: number
    y: number
    page: number
  }

  const createInstrumentedDoc = () => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 70, bottom: 70, left: 70, right: 70 },
      bufferPages: true,
    })
    doc.font('Times-Roman').fontSize(11)

    const frags: Frag[] = []
    const currentPage = () => doc.bufferedPageRange().count

    const docInternals = (doc as unknown) as {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _fragment: (text: string, x: number, y: number, options: unknown) => void
    }
    const originalFragment = docInternals._fragment.bind(doc)
    docInternals._fragment = (
      text: string,
      x: number,
      y: number,
      options: unknown,
    ) => {
      frags.push({ text: `${text}`, x, y, page: currentPage() })
      return originalFragment(text, x, y, options)
    }

    return { doc, frags, currentPage }
  }

  const visibleText = (frags: Frag[]) => frags.map((f) => f.text).join('')

  it('keeps a short name on one line without truncating', () => {
    const { doc, frags } = createInstrumentedDoc()

    addNumberedList(doc, ['Skjal.pdf'])

    expect(visibleText(frags)).toContain('Skjal.pdf')
    expect(visibleText(frags)).not.toContain('...')
    const nameFrags = frags.filter((f) => f.text.includes('Skjal'))
    const ys = [...new Set(nameFrags.map((f) => Math.round(f.y)))]
    expect(ys).toHaveLength(1)
    doc.end()
  })

  it('wraps a long name with spaces onto multiple lines', () => {
    const { doc, frags } = createInstrumentedDoc()
    const name = Array.from({ length: 20 }, (_, i) => `kafli${i}`).join(' ')

    addNumberedList(doc, [name])

    expect(visibleText(frags)).toContain('kafli0')
    expect(visibleText(frags)).toContain('kafli19')
    expect(visibleText(frags)).not.toContain('...')
    expect(visibleText(frags)).not.toContain('\u200B')
    const nameFrags = frags.filter((f) => /kafli\d+/.test(f.text))
    const ys = [...new Set(nameFrags.map((f) => Math.round(f.y)))]
    expect(ys.length).toBeGreaterThan(1)
    doc.end()
  })

  it('wraps a long name with no spaces onto multiple lines via PDFKit', () => {
    const { doc, frags } = createInstrumentedDoc()
    const name = `${'a'.repeat(120)}.pdf`

    addNumberedList(doc, [name])

    expect(visibleText(frags)).toBe(`1${name}`)
    expect(visibleText(frags)).not.toContain('...')
    expect(visibleText(frags)).not.toContain('\u200B')
    const nameFrags = frags.filter(
      (f) => f.text.includes('a') || f.text.includes('.pdf'),
    )
    const ys = [...new Set(nameFrags.map((f) => Math.round(f.y)))]
    expect(ys.length).toBeGreaterThan(1)

    const rightEdge = doc.page.width - doc.page.margins.right
    for (const frag of nameFrags) {
      expect(frag.x + doc.widthOfString(frag.text)).toBeLessThanOrEqual(
        rightEdge + 2,
      )
    }
    doc.end()
  })

  it('moves a wrapping item to the next page instead of leaving an empty page gap', () => {
    const { doc, frags, currentPage } = createInstrumentedDoc()
    const name = `${'b'.repeat(120)}.pdf`

    // Park near the bottom so a multi-line item cannot fit on this page.
    doc.y = doc.page.height - doc.page.margins.bottom - 15
    const pagesBefore = currentPage()

    addNumberedList(doc, [name])

    expect(currentPage()).toBeGreaterThan(pagesBefore)
    const nameFrags = frags.filter(
      (f) => f.text.includes('b') || f.text.includes('.pdf'),
    )
    expect(nameFrags.length).toBeGreaterThan(0)
    expect(nameFrags.every((f) => f.page > pagesBefore)).toBe(true)
    expect(visibleText(frags)).toContain(name)
    expect(visibleText(frags)).not.toContain('\u200B')
    doc.end()
  })
})
