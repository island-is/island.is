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
})

describe('addRichText layout', () => {
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
    const font = (doc as unknown as { _font: { name: string } })._font
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

    const docInternals = doc as unknown as {
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
