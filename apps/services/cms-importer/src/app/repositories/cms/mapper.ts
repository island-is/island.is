import { decode } from 'html-entities'
import { isDefined } from '@island.is/shared/utils'
import { Link } from 'contentful-management'
import { BLOCKS } from '@contentful/rich-text-types'
import { LOCALE, EN_LOCALE } from '../../constants'
import {
  CmsRichTextDocument,
  EntryCreationDto,
  Localized,
  RichTextParagraph,
} from './cms.types'

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

interface Props {
  listId: string
  properties: {
    internalTitle: string
    title: Localized<string>
    slug: Localized<string>
    tagIds?: string[]
    cardIntro?: Localized<Array<RichTextParagraph>>
    content?: Localized<Array<RichTextParagraph>>
  }
  ownerTags: string[]
}

export const generateGenericListItem = ({
  listId,
  ownerTags,
  properties,
}: Props): EntryCreationDto | undefined => {
  const { internalTitle, title, slug, tagIds, cardIntro, content } = properties

  const newEntry: EntryCreationDto['fields'] = {
    genericList: mapLocalizedValue<Link<'Entry'>>({
      sys: {
        type: 'Link',
        id: listId,
        linkType: 'Entry',
      },
    }),
    ...(cardIntro && {
      cardIntro: mapLocalizedRichTextDocument(cardIntro['is-IS'], cardIntro.en),
    }),
    internalTitle: mapLocalizedValue(internalTitle),
    ...(tagIds && {
      filterTags: mapLocalizedValue(
        tagIds.filter(isDefined).map((tagId) => ({
          sys: {
            id: tagId,
            linkType: 'Entry',
          },
        })),
      ),
    }),
    title,
    slug,
    ...(content && {
      content: mapLocalizedRichTextDocument(content['is-IS'], content.en),
    }),
    fullWidthImageInContent: mapLocalizedValue(false),
  }
  return {
    fields: newEntry,
    metadata: {
      tags: ownerTags.map((ownerTag) => ({
        sys: {
          type: 'Link',
          linkType: 'Tag',
          id: ownerTag,
        },
      })),
    },
  }
}

export const mapLocalizedRichTextDocument = (
  isContent: Array<RichTextParagraph>,
  enContent?: Array<RichTextParagraph>,
): Localized<CmsRichTextDocument> => {
  return {
    ...(enContent && {
      [EN_LOCALE]: {
        data: {},
        nodeType: BLOCKS.DOCUMENT,
        content: enContent.map((paragraph) => ({
          data: {},
          nodeType: BLOCKS.PARAGRAPH,
          content: paragraph.values.map((item) => ({
            data: {},
            marks: item.isBold ? [{ type: 'bold' as const }] : [],
            value: item.value,
            nodeType: 'text' as const,
          })),
        })),
      },
    }),
    [LOCALE]: {
      data: {},
      nodeType: BLOCKS.DOCUMENT,
      content: isContent.map((paragraph) => ({
        data: {},
        nodeType: BLOCKS.PARAGRAPH,
        content: paragraph.values.map((item) => ({
          data: {},
          marks: item.isBold ? [{ type: 'bold' as const }] : [],
          value: item.value,
          nodeType: 'text' as const,
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
