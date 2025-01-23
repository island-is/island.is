import { Block, BLOCKS, Document, Text } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'

import { AllSlicesFragment as Slice } from '@island.is/web/graphql/schema'

const headingLevels = ['h2', 'h3', 'h4', 'h5'] as const
type HeadingType = typeof headingLevels[number]
interface NavLink {
  id: string
  text: string
}

interface Navigable {
  id: string
  title: string
}

const isNavigable = (slice: Slice) =>
  typeof slice === 'object' &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  slice['id'] &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  slice['title'] &&
  slice.__typename !== 'Image' &&
  slice.__typename !== 'Asset' &&
  // If there's not a showTitle field on the slice or it's set to true we want to show the title
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  (slice['showTitle'] ?? true)

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

  if (isNavigable(slice)) {
    const { id, title: text } = slice as Navigable
    return [{ id, text }]
  }

  return []
}

export const extractHeadingLevels = (slice: {
  titleHeadingLevel?: string | null
}) => {
  let titleHeading: HeadingType = 'h2'
  let childHeading: HeadingType = 'h3'

  if (headingLevels.includes(slice.titleHeadingLevel as HeadingType)) {
    titleHeading = slice.titleHeadingLevel as HeadingType
    childHeading = `h${Number(titleHeading[1]) + 1}` as HeadingType
  }

  return { titleHeading, childHeading }
}
