import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { parse } from 'node-html-parser'
import { LOCALE, EN_LOCALE } from '../constants'
import {
  CmsRichTextDocument,
  EntryCreationDto,
  Localized,
  RichTextParagraph,
  RichTextValue,
} from './cms.types'

export const decodeEntities = (value: string): string => parse(value).text

export const stripHtml = (html: string): string =>
  decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim()

export const makeTagMetadata = (
  ...tagIds: string[]
): EntryCreationDto['metadata'] => ({
  tags: tagIds.map((id) => ({
    sys: {
      type: 'Link',
      linkType: 'Tag',
      id,
    },
  })),
})

const buildInlineNode = (item: RichTextValue) => {
  const textNode = {
    data: {},
    nodeType: 'text' as const,
    marks: item.isBold ? [{ type: MARKS.BOLD }] : [],
    value: item.value,
  }

  if (!item.link) {
    return textNode
  }

  if (item.link.type === 'hyperlink') {
    return {
      data: { uri: item.link.uri },
      nodeType: INLINES.HYPERLINK,
      content: [textNode],
    }
  }

  return {
    data: {
      target: {
        sys: {
          type: 'Link' as const,
          linkType: 'Asset' as const,
          id: item.link.assetId,
        },
      },
    },
    nodeType: INLINES.ASSET_HYPERLINK,
    content: [textNode],
  }
}

const buildRichTextDocument = (
  paragraphs: Array<RichTextParagraph>,
): CmsRichTextDocument => ({
  data: {},
  nodeType: BLOCKS.DOCUMENT,
  content: paragraphs.map((paragraph) => ({
    data: {},
    nodeType: BLOCKS.PARAGRAPH,
    content: paragraph.values.map(buildInlineNode),
  })),
})

export const mapLocalizedRichTextDocument = (
  isContent: Array<RichTextParagraph>,
  enContent?: Array<RichTextParagraph>,
): Localized<CmsRichTextDocument> => {
  return {
    ...(enContent && {
      [EN_LOCALE]: buildRichTextDocument(enContent),
    }),
    [LOCALE]: buildRichTextDocument(isContent),
  }
}

export const mapLocalizedValue = <T>(isValue: T, enValue?: T): Localized<T> => {
  if (enValue) {
    return {
      [LOCALE]: isValue,
      [EN_LOCALE]: enValue,
    }
  }
  return {
    [LOCALE]: isValue,
  }
}
