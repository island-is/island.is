import { isDefined } from '@island.is/shared/utils'
import { LOCALE, EN_LOCALE } from '../../constants'
import {
  CmsRichTextDocument,
  EntryCreationDto,
  Localized,
  RichTextParagraph,
} from './cms.types'

interface Props {
  listId: string
  properties: {
    internalTitle: string
    title: Localized<unknown>
    slug: Localized<unknown>
    tagIds?: string[]
    cardIntro?: Localized<Array<RichTextParagraph>>
    content?: Localized<Array<RichTextParagraph>>
    assetId?: string
    externalLinkId?: string
  }
  ownerTags: string[]
}

export const generateGenericListItem = ({
  listId,
  ownerTags,
  properties,
}: Props): EntryCreationDto | undefined => {
  const {
    internalTitle,
    title,
    slug,
    tagIds,
    cardIntro,
    content,
    assetId,
    externalLinkId,
  } = properties

  const newEntry: EntryCreationDto['fields'] = {
    genericList: mapLocalizedValue<unknown>({
      sys: {
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
    ...(assetId && {
      asset: mapLocalizedValue<unknown>({
        sys: { id: assetId, linkType: 'Asset' },
      }),
    }),
    ...(externalLinkId && {
      externalLink: mapLocalizedValue<unknown>({
        sys: { id: externalLinkId, linkType: 'Entry' },
      }),
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
