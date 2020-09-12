import { Slice } from '@island.is/web/graphql/schema'
import { Document, BLOCKS, Block, Text } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'

export interface NavLink {
  id: string
  text: string
}

export interface NavGenOptions {
  htmlTags?: BLOCKS[]
}

export const createNavigation = (
  slices: Slice[],
  { htmlTags = [BLOCKS.HEADING_2] }: { htmlTags?: BLOCKS[] } = {},
): NavLink[] => {
  const nav: NavLink[] = []

  for (const slice of slices) {
    const n = sliceToNavLinks(slice, htmlTags)
    Array.isArray(n) ? nav.push(...n) : nav.push(n)
  }

  return nav
}

const extractNodeText = (block: Block): string => {
  return block.content
    .filter((child): child is Text => child.nodeType === 'text')
    .map((child) => child.value)
    .join('')
}

const sliceToNavLinks = (
  slice: Slice,
  htmlTags: BLOCKS[],
): NavLink | NavLink[] => {
  switch (slice.__typename) {
    case 'ProcessEntry':
    case 'FaqList':
      return {
        id: slice.id,
        text: slice.title,
      }
    case 'Html':
      return (slice.document as Document).content
        .filter((node) => htmlTags.includes(node.nodeType))
        .map(extractNodeText)
        .map((text) => ({
          id: slugify(text),
          text,
        }))
  }
}
