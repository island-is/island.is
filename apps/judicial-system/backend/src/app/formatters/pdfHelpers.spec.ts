import { htmlToBlocks } from './pdfHelpers'

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

  it('produces multiple runs within one paragraph', () => {
    const blocks = htmlToBlocks('<p>normal <strong>bold</strong> end</p>')
    expect(blocks[0].runs).toHaveLength(3)
    expect(blocks[0].runs[0]).toMatchObject({ text: 'normal ', bold: false })
    expect(blocks[0].runs[1]).toMatchObject({ text: 'bold', bold: true })
    expect(blocks[0].runs[2]).toMatchObject({ text: ' end', bold: false })
  })

  it('adds indent for blockquote', () => {
    const blocks = htmlToBlocks('<blockquote><p>indented</p></blockquote>')
    expect(blocks[0].indent).toBe(20)
  })

  it('adds cumulative indent for nested blockquotes', () => {
    const blocks = htmlToBlocks(
      '<blockquote><blockquote><p>deep</p></blockquote></blockquote>',
    )
    expect(blocks[0].indent).toBe(40)
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

  it('adds a newline run for <br>', () => {
    const blocks = htmlToBlocks('<p>line1<br>line2</p>')
    const texts = blocks[0].runs.map((r) => r.text)
    expect(texts).toContain('\n')
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

  describe('mixed indentation', () => {
    it('sums blockquote indent and padding-left (blockquote=20 + 40px→30pt = 50)', () => {
      const blocks = htmlToBlocks(
        '<blockquote><p style="padding-left: 40px;">text</p></blockquote>',
      )
      expect(blocks[0].indent).toBe(50)
      expect(blocks[0].runs[0].text).toBe('text')
    })

    it('sums two blockquote levels and padding-left (40 + 20px→15pt = 55)', () => {
      const blocks = htmlToBlocks(
        '<blockquote><blockquote><p style="padding-left: 20px;">text</p></blockquote></blockquote>',
      )
      expect(blocks[0].indent).toBe(55)
    })
  })

  describe('deep nesting', () => {
    it('accumulates correct indent for 4 nested blockquotes (4 × 20 = 80)', () => {
      const html =
        '<blockquote><blockquote><blockquote><blockquote><p>deep</p></blockquote></blockquote></blockquote></blockquote>'
      const blocks = htmlToBlocks(html)
      expect(blocks[0].indent).toBe(80)
      expect(blocks[0].runs[0].text).toBe('deep')
    })

    it('extracts runs correctly from many nested container elements', () => {
      const html =
        '<div><div><blockquote><blockquote><p><strong>bold deep</strong></p></blockquote></blockquote></div></div>'
      const blocks = htmlToBlocks(html)
      expect(blocks[0].indent).toBe(40)
      expect(blocks[0].runs[0]).toMatchObject({ text: 'bold deep', bold: true })
    })
  })

  describe('empty and whitespace-only content', () => {
    it('returns no blocks for empty string input', () => {
      const blocks = htmlToBlocks('')
      expect(blocks).toHaveLength(0)
    })

    it('preserves whitespace-only text as a run within a paragraph', () => {
      const blocks = htmlToBlocks('<p>   </p>')
      expect(blocks).toHaveLength(1)
      expect(blocks[0].runs).toHaveLength(1)
      expect(blocks[0].runs[0].text.trim()).toBe('')
    })
  })
})
