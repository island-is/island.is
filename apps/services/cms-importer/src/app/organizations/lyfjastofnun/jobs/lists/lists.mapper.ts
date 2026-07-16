import slugify from '@sindresorhus/slugify'
import { EN_LOCALE, LOCALE } from '../../../../constants'
import { EntryCreationDto, Localized, RichTextParagraph } from '../../../../platform/cms.types'
import { generateGenericListItem } from '../../../../platform/content-types/generic-list-item.mapper'
import { mapLocalizedValue } from '../../../../platform/localization'
import { LyfjastofnunScrapedItem } from '../../lyfjastofnun.types'
import { LYFJASTOFNUN_OWNER_TAG } from '../../lyfjastofnun.constants'
import {
  CATEGORY_TAG_IDS,
  FILE_TYPE_LABELS_EN,
  FILE_TYPE_LABELS_IS,
} from './constants'

export const resolveCategoryTagId = (groupTitle: string): string => {
  if (/dýr/i.test(groupTitle)) return CATEGORY_TAG_IDS.animals
  if (/mann/i.test(groupTitle)) return CATEGORY_TAG_IDS.men
  return CATEGORY_TAG_IDS.other
}

export const mapSlug = (item: LyfjastofnunScrapedItem): string =>
  slugify(item.title)

const resolveTitleEn = (item: LyfjastofnunScrapedItem): string | undefined =>
  item.titleEn

const resolveFileExtension = (fileUrl: string): string =>
  fileUrl.split('.').pop()?.split('?')[0]?.toLowerCase() ?? ''

const buildCardIntro = (
  item: LyfjastofnunScrapedItem,
): Localized<Array<RichTextParagraph>> | undefined => {
  let valueIs: string | undefined
  let valueEn: string | undefined

  if (item.externalUrl) {
    valueIs = 'Á vef Sérlyfjaskrár'
    valueEn = 'On the Sérlyfjaskrá website'
  } else if (item.fileUrl) {
    const ext = resolveFileExtension(item.fileUrl)
    valueIs = FILE_TYPE_LABELS_IS[ext] ?? 'Skrá'
    valueEn = FILE_TYPE_LABELS_EN[ext] ?? 'File'
  }

  if (!valueIs || !valueEn) return undefined

  return {
    [LOCALE]: [{ values: [{ value: valueIs }] }],
    [EN_LOCALE]: [{ values: [{ value: valueEn }] }],
  }
}

export const mapEntryCreationDto = (
  item: LyfjastofnunScrapedItem,
  genericListId: string,
  link: { assetId?: string; externalLinkId?: string },
): EntryCreationDto | undefined => {
  const titleEn = resolveTitleEn(item)
  const slug = mapSlug(item)

  return generateGenericListItem({
    listId: genericListId,
    ownerTags: [LYFJASTOFNUN_OWNER_TAG],
    properties: {
      internalTitle: `Lyfjastofnun: ${item.title}`,
      title: mapLocalizedValue(item.title, titleEn),
      slug: mapLocalizedValue(slug, titleEn ? slugify(titleEn) : undefined),
      tagIds: [resolveCategoryTagId(item.groupTitle)],
      cardIntro: buildCardIntro(item),
      assetId: link.assetId,
      externalLinkId: link.externalLinkId,
    },
  })
}
