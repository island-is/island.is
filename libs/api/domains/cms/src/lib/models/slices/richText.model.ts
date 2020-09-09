import { Document, BLOCKS, TopLevelBlock } from '@contentful/rich-text-types'

import { Slice } from '../slices/slice.model'
import { mapImage } from '../image.model'
import { Html } from '../slices/html.model'

const mapTopLevelBlock = (
  block: TopLevelBlock,
  index: number,
): typeof Slice => {
  switch (block.nodeType) {
    case BLOCKS.EMBEDDED_ENTRY:
      return mapSlice(block.data.target)
    case BLOCKS.EMBEDDED_ASSET:
      // Only asset we can handle at the moment is an image
      return mapImage(block.data.target)
    default:
      return new Html({
        id: index.toString(),
        // TODO
        document: JSON.stringify({
          nodeType: BLOCKS.DOCUMENT,
          content: [block],
        }),
      })
  }
}

export const mapRichText = (document: Document): Array<typeof Slice> => {
  return document.content.map(mapTopLevelBlock)
}
