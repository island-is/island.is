import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { htmlToRichTextDocument } from './news.mapper'

describe('htmlToRichTextDocument', () => {
  it('keeps nested list items after the inner list closes', () => {
    const document = htmlToRichTextDocument(
      '<ul><li><a href="https://a.is">A</a><ul><li>A1</li></ul></li><li>B</li></ul>',
    )

    const [list] = document.content
    expect(list.nodeType).toBe(BLOCKS.UL_LIST)
    expect(list.content).toHaveLength(2)
    expect(list.content[0]).toMatchObject({
      content: [{ nodeType: BLOCKS.PARAGRAPH }, { nodeType: BLOCKS.UL_LIST }],
    })
    expect(JSON.stringify(list)).toContain('"value":"B"')
  })

  it('keeps text outside recognised blocks in source order', () => {
    const document = htmlToRichTextDocument('<p>First</p>Loose text<p>Last</p>')

    expect(
      document.content.map((block) => JSON.stringify(block.content)),
    ).toEqual([
      expect.stringContaining('First'),
      expect.stringContaining('Loose text'),
      expect.stringContaining('Last'),
    ])
  })

  it('maps strong and em to marks inside links and paragraphs', () => {
    const document = htmlToRichTextDocument(
      '<p>Plain <strong>bold</strong> <a href="https://a.is"><em>link</em></a></p>',
    )

    const [paragraph] = document.content
    expect(paragraph.content).toEqual([
      expect.objectContaining({ value: 'Plain ', marks: [] }),
      expect.objectContaining({
        value: 'bold',
        marks: [{ type: MARKS.BOLD }],
      }),
      expect.objectContaining({ value: ' ' }),
      expect.objectContaining({
        nodeType: INLINES.HYPERLINK,
        data: { uri: 'https://a.is' },
        content: [
          expect.objectContaining({
            value: 'link',
            marks: [{ type: MARKS.ITALIC }],
          }),
        ],
      }),
    ])
  })
})
