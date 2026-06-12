import PDFDocument from 'pdfkit'

import { addRichText, htmlToBlocks } from './pdfHelpers'

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
    expect(blocks[0].runs[0]).toMatchObject({ highlight: 'rgb(255, 255, 0)' })
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

    it('strips <ul> and <li> and captures list item text as blocks', () => {
      const blocks = htmlToBlocks('<ul><li>item one</li><li>item two</li></ul>')
      const texts = blocks.map((b) => b.runs.map((r) => r.text).join(''))
      expect(texts).toContain('item one')
      expect(texts).toContain('item two')
    })

    it('strips <ol> and <li> and captures ordered list items as blocks', () => {
      const blocks = htmlToBlocks('<ol><li>first</li><li>second</li></ol>')
      const texts = blocks.map((b) => b.runs.map((r) => r.text).join(''))
      expect(texts).toContain('first')
      expect(texts).toContain('second')
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
})

describe('addRichText highlight placement', () => {
  interface Rect {
    x: number
    y: number
    w: number
    h: number
    page: number
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

    const originalRect = doc.rect.bind(doc)
    doc.rect = (x: number, y: number, w: number, h: number) => {
      rects.push({ x, y, w, h, page: currentPage() })
      return originalRect(x, y, w, h)
    }

    const docInternals = doc as unknown as {
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

  it('keeps rect and text together when the block moves to a new page', () => {
    const { doc, rects, frags } = createInstrumentedDoc()

    // Park the cursor so close to the bottom margin that the first line no
    // longer fits; PDFKit moves the text to a new page and the rect must
    // follow it.
    doc.y = doc.page.height - doc.page.margins.bottom - 5
    addRichText(
      doc,
      '<p><span style="background-color: #FFF066;">MARKER</span></p>',
    )

    const frag = findFragmentWith(frags, 'MARKER')
    expect(rects).toHaveLength(1)
    expect(rects[0].page).toBe(frag.page)
    expect(Math.abs(rects[0].y - frag.y)).toBeLessThanOrEqual(Y_TOLERANCE)
    doc.end()
  })
})
