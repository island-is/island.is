import slugify from '@sindresorhus/slugify'
import { LOCALE } from '../constants'
import {
  EntryCreationDto,
  Localized,
  RichTextParagraph,
} from '../repositories/cms/cms.types'
import {
  generateGenericListItem,
  mapLocalizedValue,
} from '../repositories/cms/mapper'
import { LyfjastofnunListItem } from '../repositories/lyfjastofnun-lists/lyfjastofnun-lists.types'
import { CATEGORY_TAG_IDS, OWNER_TAG } from './constants'

export const resolveCategoryTagId = (groupTitle: string): string => {
  if (/dýr/i.test(groupTitle)) return CATEGORY_TAG_IDS.animals
  if (/mann/i.test(groupTitle)) return CATEGORY_TAG_IDS.men
  return CATEGORY_TAG_IDS.other
}

export const mapSlug = (item: LyfjastofnunListItem): string =>
  slugify(item.title)

const buildCardIntro = (
  item: LyfjastofnunListItem,
): Localized<Array<RichTextParagraph>> | undefined => {
  if (!item.formatLabel) return undefined
  return {
    [LOCALE]: [{ values: [{ value: item.formatLabel }] }],
  }
}

export const mapEntryCreationDto = (
  item: LyfjastofnunListItem,
  genericListId: string,
  link: { assetId?: string; externalLinkId?: string },
): EntryCreationDto | undefined =>
  generateGenericListItem({
    listId: genericListId,
    ownerTags: [OWNER_TAG],
    properties: {
      internalTitle: `Lyfjastofnun listar: ${item.title}`,
      title: mapLocalizedValue(item.title),
      slug: mapLocalizedValue(mapSlug(item)),
      tagIds: [resolveCategoryTagId(item.groupTitle)],
      cardIntro: buildCardIntro(item),
      assetId: link.assetId,
      externalLinkId: link.externalLinkId,
    },
  })
