import { decode } from 'html-entities'
import { LOCALE, EN_LOCALE } from '../constants'
import { CmsRichTextDocument, EntryCreationDto, Localized, RichTextParagraph } from './cms.types'

export const stripHtml = (html: string): string =>
  decode(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim()

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

export const mapLocalizedRichTextDocument = (
  isContent: Array<RichTextParagraph>,
  enContent?: Array<RichTextParagraph>,
): Localized<CmsRichTextDocument> => {
  return {
    ...(enContent && {
      [EN_LOCALE]: {
        data: {},
        nodeType: 'document',
        content: enContent.map((paragraph) => ({
          data: {},
          nodeType: 'paragraph',
          content: paragraph.values.map((item) => ({
            data: {},
            marks: item.isBold ? [{ type: 'bold' }] : [],
            value: item.value,
            nodeType: 'text',
          })),
        })),
      },
    }),
    [LOCALE]: {
      data: {},
      nodeType: 'document',
      content: isContent.map((paragraph) => ({
        data: {},
        nodeType: 'paragraph',
        content: paragraph.values.map((item) => ({
          data: {},
          marks: item.isBold ? [{ type: 'bold' }] : [],
          value: item.value,
          nodeType: 'text',
        })),
      })),
    },
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
