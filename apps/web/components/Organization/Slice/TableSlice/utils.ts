import { Block, BLOCKS, Document, helpers } from '@contentful/rich-text-types'

const extractTableFromRichTextDocument = (document?: Document) => {
  return document?.content?.find((c) => c?.nodeType === 'table')
}

export const extractTableRowsFromRichTextDocument = (document?: Document) => {
  const table = extractTableFromRichTextDocument(document)
  if (!table) return []
  return (table.content?.filter((item) => item.nodeType === BLOCKS.TABLE_ROW) ??
    []) as Block[]
}

export const isHeaderRow = (row: Block) => {
  if (!helpers.isBlock(row)) return false
  return (
    row.nodeType === BLOCKS.TABLE_ROW &&
    row.content.every((item) => item.nodeType === BLOCKS.TABLE_HEADER_CELL)
  )
}

export const extractTextFromRichTextTableCell = (block: Block) => {
  if (!helpers.isBlock(block)) return ''
  let text = ''
  for (const item of block.content) {
    if (item.nodeType !== BLOCKS.PARAGRAPH) continue
    for (const node of item.content) {
      if (helpers.isText(node)) {
        text += node.value
      }
    }
  }
  return text
}
