import { Block, BLOCKS, Document } from '@contentful/rich-text-types'

import {
  extractTableRowsFromRichTextDocument,
  extractTextFromRichTextTableCell,
  isHeaderRow,
} from './utils'

describe('rich text document content extraction', () => {
  const document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: 'text',
            value: '',
            marks: [],
            data: {},
          },
        ],
      },
      {
        nodeType: BLOCKS.TABLE,
        data: {},
        content: [
          {
            nodeType: BLOCKS.TABLE_ROW,
            data: {},
            content: [
              {
                nodeType: BLOCKS.TABLE_HEADER_CELL,
                data: {},
                content: [
                  {
                    nodeType: BLOCKS.PARAGRAPH,
                    data: {},
                    content: [
                      {
                        nodeType: 'text',
                        value: 'Header 1',
                        marks: [],
                        data: {},
                      },
                    ],
                  },
                ],
              },
              {
                nodeType: BLOCKS.TABLE_HEADER_CELL,
                data: {},
                content: [
                  {
                    nodeType: BLOCKS.PARAGRAPH,
                    data: {},
                    content: [
                      {
                        nodeType: 'text',
                        value: 'Header 2',
                        marks: [],
                        data: {},
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            nodeType: BLOCKS.TABLE_ROW,
            data: {},
            content: [
              {
                nodeType: BLOCKS.TABLE_CELL,
                data: {},
                content: [
                  {
                    nodeType: BLOCKS.PARAGRAPH,
                    data: {},
                    content: [
                      {
                        nodeType: 'text',
                        value: 'Content is here 2',
                        marks: [],
                        data: {},
                      },
                    ],
                  },
                ],
              },
              {
                nodeType: BLOCKS.TABLE_CELL,
                data: {},
                content: [
                  {
                    nodeType: BLOCKS.PARAGRAPH,
                    data: {},
                    content: [
                      {
                        nodeType: 'text',
                        value: 'Hello there',
                        marks: [],
                        data: {},
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            nodeType: BLOCKS.TABLE_ROW,
            data: {},
            content: [
              {
                nodeType: BLOCKS.TABLE_CELL,
                data: {},
                content: [
                  {
                    nodeType: BLOCKS.PARAGRAPH,
                    data: {},
                    content: [
                      {
                        nodeType: 'text',
                        value: 'asdf',
                        marks: [],
                        data: {},
                      },
                    ],
                  },
                ],
              },
              {
                nodeType: BLOCKS.TABLE_CELL,
                data: {},
                content: [
                  {
                    nodeType: BLOCKS.PARAGRAPH,
                    data: {},
                    content: [
                      {
                        nodeType: 'text',
                        value: 'bbbbb',
                        marks: [],
                        data: {},
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            nodeType: BLOCKS.TABLE_ROW,
            data: {},
            content: [
              {
                nodeType: BLOCKS.TABLE_CELL,
                data: {},
                content: [
                  {
                    nodeType: BLOCKS.PARAGRAPH,
                    data: {},
                    content: [
                      {
                        nodeType: 'text',
                        value: 'asdffffff',
                        marks: [],
                        data: {},
                      },
                    ],
                  },
                ],
              },
              {
                nodeType: BLOCKS.TABLE_CELL,
                data: {},
                content: [
                  {
                    nodeType: BLOCKS.PARAGRAPH,
                    data: {},
                    content: [
                      {
                        nodeType: 'text',
                        value: 'aaqerss',
                        marks: [],
                        data: {},
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: 'text',
            value: 'test',
            marks: [],
            data: {},
          },
        ],
      },
    ],
  }

  it('should extract the correct number of table rows', () => {
    const rows = extractTableRowsFromRichTextDocument(document)
    expect(rows.length).toBe(4)
  })

  it('should figure out whether a row is a header', () => {
    const rows = extractTableRowsFromRichTextDocument(document)
    expect(isHeaderRow(rows[0])).toBe(true)
    expect(isHeaderRow(rows[1])).toBe(false)
  })

  it('should extract the correct text from the rich text table cells', () => {
    const rows = extractTableRowsFromRichTextDocument(document)
    const header = rows[0]
    expect(extractTextFromRichTextTableCell(header.content[0] as Block)).toBe(
      'Header 1',
    )
    expect(extractTextFromRichTextTableCell(header.content[1] as Block)).toBe(
      'Header 2',
    )
  })
})
