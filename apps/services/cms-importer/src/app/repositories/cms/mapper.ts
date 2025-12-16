import { isDefined } from '@island.is/shared/utils'
import { LOCALE, EN_LOCALE } from '../../constants'
import { CreationType, LocalizedContent, LocalizedValue } from './cms.types'

interface Props {
  listId: string
  properties: {
    internalTitle: string
    title: LocalizedValue
    slug: LocalizedValue
    tagIds?: string[]
    cardIntro?: LocalizedContent
    content?: LocalizedContent
  }
  ownerTags: string[]
}

export const generateGenericListItem = ({
  listId,
  ownerTags,
  properties,
}: Props): CreationType | undefined => {
  const { internalTitle, title, slug, tagIds, cardIntro, content } = properties

  const newEntry: CreationType['fields'] = {
    genericList: {
      [LOCALE]: {
        sys: {
          id: listId,
          linkType: 'Entry',
        },
      },
    },
    ...(cardIntro && {
      cardIntro: generateContentFormatting(cardIntro),
    }),
    internalTitle: {
      [LOCALE]: internalTitle,
    },
    ...(tagIds && {
      filterTags: {
        [LOCALE]: tagIds.filter(isDefined).map((tagId) => ({
          sys: {
            id: tagId,
            linkType: 'Entry',
          },
        })),
      },
    }),
    title,
    slug,
    ...(content && {
      content: generateContentFormatting(content),
    }),
    fullWidthImageInContent: {
      [LOCALE]: false,
    },
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

const generateContentFormatting = (content: LocalizedContent) => {
  return {
    [EN_LOCALE]: {
      data: {},
      nodeType: 'document',
      content: content.en.map((paragraph) => ({
        data: {},
        nodeType: 'paragraph',
        content: paragraph.items.map((item) => ({
          data: {},
          marks: item.isBold ? [{ type: 'bold' }] : [],
          value: item.value,
          nodeType: 'text',
        })),
      })),
    },
    [LOCALE]: {
      data: {},
      nodeType: 'document',
      content: content['is-IS'].map((paragraph) => ({
        data: {},
        nodeType: 'paragraph',
        content: paragraph.items.map((item) => ({
          data: {},
          marks: item.isBold ? [{ type: 'bold' }] : [],
          value: item.value,
          nodeType: 'text',
        })),
      })),
    },
  }
}
