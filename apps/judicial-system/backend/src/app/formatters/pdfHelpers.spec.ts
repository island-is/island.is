import { htmlToBlocks } from './pdfHelpers'

describe('htmlToBlocks', () => {
  it('wraps plain text in a single block', () => {
    const blocks = htmlToBlocks('Hello world')
    expect(blocks).toEqual([
      { runs: [{ text: 'Hello world', bold: false, italic: false, highlight: false }], indent: 0 },
    ])
  })

  it('parses a simple paragraph', () => {
    const blocks = htmlToBlocks('<p>Hello world</p>')
    expect(blocks).toEqual([
      { runs: [{ text: 'Hello world', bold: false, italic: false, highlight: false }], indent: 0 },
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
    expect(blocks[0].runs[0]).toMatchObject({ text: 'bold', bold: true, italic: false })
  })

  it('marks italic runs', () => {
    const blocks = htmlToBlocks('<p><em>italic</em></p>')
    expect(blocks[0].runs[0]).toMatchObject({ text: 'italic', bold: false, italic: true })
  })

  it('marks bold+italic for nested strong and em', () => {
    const blocks = htmlToBlocks('<p><strong><em>both</em></strong></p>')
    expect(blocks[0].runs[0]).toMatchObject({ bold: true, italic: true })
  })

  it('marks highlight for <mark>', () => {
    const blocks = htmlToBlocks('<p><mark>highlighted</mark></p>')
    expect(blocks[0].runs[0]).toMatchObject({ text: 'highlighted', highlight: true })
  })

  it('marks highlight for span with background-color style', () => {
    const blocks = htmlToBlocks('<p><span style="background-color: #ffff00;">highlighted</span></p>')
    expect(blocks[0].runs[0]).toMatchObject({ highlight: true })
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
    const blocks = htmlToBlocks('<blockquote><blockquote><p>deep</p></blockquote></blockquote>')
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
})
