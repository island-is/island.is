import slugify from '@sindresorhus/slugify'
import { EntryCreationDto } from '../../../../platform/cms.types'
import { generateGenericListItem } from '../../../../platform/content-types/generic-list-item.mapper'
import { mapLocalizedValue } from '../../../../platform/localization'
import { LyfjastofnunScrapedItem } from '../../lyfjastofnun.types'
import { LYFJASTOFNUN_OWNER_TAG } from '../../lyfjastofnun.constants'
import { CATEGORY_TAG_IDS } from './constants'
import { TITLE_OVERRIDES_IS, TITLE_TRANSLATIONS_EN } from './title-translations'

export const resolveCategoryTagId = (groupTitle: string): string => {
  switch (groupTitle) {
    case 'Verð og greiðsluþátttaka lyfja':
      return CATEGORY_TAG_IDS.pricingAndReimbursement
    case 'Lækningatæki':
      return CATEGORY_TAG_IDS.medicalDevices
    case 'Heilbrigðisstofnanir':
      return CATEGORY_TAG_IDS.healthInstitutions
    case 'Apótek':
      return CATEGORY_TAG_IDS.pharmacies
    default:
      return CATEGORY_TAG_IDS.other
  }
}

// One item's scraped "Icelandic" title is actually English (see
// title-translations.ts) — resolve the real Icelandic title before using it
// anywhere the is-IS locale is populated.
const resolveTitleIs = (item: LyfjastofnunScrapedItem): string =>
  TITLE_OVERRIDES_IS[item.title] ?? item.title

export const mapSlug = (item: LyfjastofnunScrapedItem): string =>
  slugify(resolveTitleIs(item))

const resolveTitleEn = (item: LyfjastofnunScrapedItem): string | undefined =>
  item.titleEn ?? TITLE_TRANSLATIONS_EN[item.title]

export const mapEntryCreationDto = (
  item: LyfjastofnunScrapedItem,
  genericListId: string,
  link: { assetId?: string; externalLinkId?: string },
): EntryCreationDto | undefined => {
  const titleIs = resolveTitleIs(item)
  const titleEn = resolveTitleEn(item)
  const slug = mapSlug(item)

  return generateGenericListItem({
    listId: genericListId,
    ownerTags: [LYFJASTOFNUN_OWNER_TAG],
    properties: {
      internalTitle: `Leiðbeiningar: ${titleIs}`,
      title: mapLocalizedValue(titleIs, titleEn),
      slug: mapLocalizedValue(slug, titleEn ? slugify(titleEn) : undefined),
      tagIds: [resolveCategoryTagId(item.groupTitle)],
      // No confirmed distinct English file exists for any scraped item (see
      // title-translations.ts) — the same asset/link is used for both
      // locales rather than leaving the English side empty.
      assetId: link.assetId,
      assetIdEn: link.assetId,
      externalLinkId: link.externalLinkId,
      externalLinkIdEn: link.externalLinkId,
    },
  })
}
