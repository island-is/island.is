import { Slice } from '@island.is/web/graphql/schema'
import { Document, BLOCKS, Block, Text } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'

export interface NavLink {
  id: string
  text: string
}

interface Navigatable {
  id: string
  title: string
}

const isNavigatable = (slice: any): slice is Navigatable => {
  return typeof slice === 'object' && slice.id && slice.title
}

export const createNavigation = (
  slices: Slice[],
  { htmlTags = [BLOCKS.HEADING_2] }: { htmlTags?: BLOCKS[] } = {},
): NavLink[] => {
  return slices
    .map((slice) => sliceToNavLinks(slice, htmlTags))
    .reduce((acc, links) => acc.concat(links), [])
}

const extractNodeText = (block: Block): string => {
  return block.content
    .filter((child): child is Text => child.nodeType === 'text')
    .map((child) => child.value)
    .join('')
}

const sliceToNavLinks = (slice: Slice, htmlTags: BLOCKS[]): NavLink[] => {
  if (slice.__typename === 'Html') {
    return (slice.document as Document).content
      .filter((node) => htmlTags.includes(node.nodeType))
      .map(extractNodeText)
      .map((text) => ({
        id: slugify(text),
        text,
      }))
  }

  if (isNavigatable(slice)) {
    const { id, title: text } = slice
    return [{ id, text }]
  }

  return []
}
