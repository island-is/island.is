import { BLOCKS, INLINES } from '@contentful/rich-text-types'

export const getTextPreview = (document) => {
  for (const node of document.content) {
    if (node.nodeType === BLOCKS.PARAGRAPH) {
      for (const child of node.content) {
        if (node.nodeType === 'text') {
          return node.value
        }
      }
    }
  }
}
