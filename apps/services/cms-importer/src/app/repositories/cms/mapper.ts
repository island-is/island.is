import { isDefined } from '@island.is/shared/utils'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { LOCALE, EN_LOCALE } from '../../constants'
import {
  CmsRichTextDocument,
  EntryCreationDto,
  Localized,
  RichTextParagraph,
  RichTextValue,
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
    assetId?: Localized<string>
    externalLinkId?: Localized<string>
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
      cardIntro: mapLocalizedRichTextDocument(cardIntro[LOCALE], cardIntro.en),
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
      content: mapLocalizedRichTextDocument(content[LOCALE], content.en),
    }),
    ...(assetId && {
      asset: mapLocalizedLinkId(assetId, 'Asset'),
    }),
    ...(externalLinkId && {
      externalLink: mapLocalizedLinkId(externalLinkId, 'Entry'),
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

const mapLocalizedLinkId = (
  ids: Localized<string>,
  linkType: 'Asset' | 'Entry',
): Localized<unknown> => ({
  [LOCALE]: { sys: { id: ids[LOCALE], linkType } },
  ...(ids[EN_LOCALE] && {
    [EN_LOCALE]: { sys: { id: ids[EN_LOCALE], linkType } },
  }),
})

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
