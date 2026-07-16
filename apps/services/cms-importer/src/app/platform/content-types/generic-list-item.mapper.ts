import { isDefined } from '@island.is/shared/utils'
import { EntryCreationDto, Localized, RichTextParagraph } from '../cms.types'
import { mapLocalizedRichTextDocument, mapLocalizedValue } from '../localization'

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
    assetIdEn?: string
    externalLinkId?: string
    externalLinkIdEn?: string
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
    assetIdEn,
    externalLinkId,
    externalLinkIdEn,
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
      asset: mapLocalizedValue<unknown>(
        { sys: { id: assetId, linkType: 'Asset' } },
        assetIdEn ? { sys: { id: assetIdEn, linkType: 'Asset' } } : undefined,
      ),
    }),
    ...(externalLinkId && {
      externalLink: mapLocalizedValue<unknown>(
        { sys: { id: externalLinkId, linkType: 'Entry' } },
        externalLinkIdEn
          ? { sys: { id: externalLinkIdEn, linkType: 'Entry' } }
          : undefined,
      ),
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
