import { Slice } from '@island.is/web/graphql/schema'
import { Document, BLOCKS, Block, Text } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'

interface NavLink {
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

// hide the implementation rather than have everyone import slugify themselfes
export const makeId = (s: string) => slugify(s)

export const createNavigation = (
  slices: Slice[],
  {
    htmlTags = [BLOCKS.HEADING_2],
    title,
  }: { htmlTags?: BLOCKS[]; title?: string } = {},
): NavLink[] => {
  let nav = slices
    .map((slice) => sliceToNavLinks(slice, htmlTags))
    .reduce((acc, links) => acc.concat(links), [])

  if (title) {
    nav = [{ id: makeId(title), text: title }].concat(nav)
  }

  return nav
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

  if (slice.__typename === 'ProcessEntry') {
    // this slice type was changed and its title is obsolete
    return [{ id: slice.id, text: slice.processTitle }]
  }

  if (isNavigatable(slice)) {
    const { id, title: text } = slice
    return [{ id, text }]
  }

  return []
}
