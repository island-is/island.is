import slugify from '@sindresorhus/slugify'
import { EN_LOCALE, LOCALE } from '../../../../constants'
import {
  EntryCreationDto,
  Localized,
  RichTextParagraph,
} from '../../../../platform/cms.types'
import { generateGenericListItem } from '../../../../platform/content-types/generic-list-item.mapper'
import { mapLocalizedValue } from '../../../../platform/localization'
import { LyfjastofnunScrapedItem } from '../../lyfjastofnun.types'
import { LYFJASTOFNUN_OWNER_TAG } from '../../lyfjastofnun.constants'
import {
  CATEGORY_TAG_IDS,
  EXTERNAL_LINK_LABEL_EN,
  EXTERNAL_LINK_LABEL_IS,
  FILE_CONTENT_TYPE_MAP,
} from './constants'
import { TITLE_TRANSLATIONS_EN } from './title-translations'

/*
  Keyed on the per-item `categoryTitle`, not `groupTitle` — the 12 short
  category labels map 1:1 onto the tag group, while the <h2> headings are longer
  variants of the same 12 concepts. Note the instructions job has a function of
  the same name keyed on `groupTitle`, with one nearly identical label string
  ("Verð og greiðsluþátttaka lyfja" vs "Verð og greiðsluþátttaka"); the two are
  intentionally separate and must not be merged.
*/
export const resolveCategoryTagId = (
  item: LyfjastofnunScrapedItem,
): string | undefined =>
  item.categoryTitle ? CATEGORY_TAG_IDS[item.categoryTitle] : undefined

/*
  ima.is annotates some published titles with a parenthetical caveat — five say
  "(in Icelandic)" and one "(only works in Internet Explorer)". These describe
  the document, they are not part of its name, so they are stripped here rather
  than during transcription: two of them arrive through the automatic
  cross-match (`item.titleEn`, set by the scraper) rather than through
  TITLE_TRANSLATIONS_EN, so normalising at the single resolution point is what
  covers both sources.
*/
export const stripTitleCaveats = (title: string): string =>
  title
    .replace(/\s*\((?:in Icelandic|only works in Internet Explorer)\)\s*$/i, '')
    .trim()

export const mapSlug = (item: LyfjastofnunScrapedItem): string =>
  slugify(item.title)

/*
  Table first, then the automatic cross-match — the reverse of the instructions
  job, where the cross-match is effectively empty so the order never mattered.
  Here 8 items do match automatically, and table-first keeps the hand-curated
  data authoritative and correctable.
*/
const resolveTitleEn = (item: LyfjastofnunScrapedItem): string | undefined => {
  const titleEn = TITLE_TRANSLATIONS_EN[item.title] ?? item.titleEn
  return titleEn ? stripTitleCaveats(titleEn) : undefined
}

const resolveFileExtension = (fileUrl: string): string =>
  fileUrl.split('.').pop()?.split('?')[0]?.toLowerCase() ?? ''

const buildCardIntro = (
  item: LyfjastofnunScrapedItem,
): Localized<Array<RichTextParagraph>> | undefined => {
  let valueIs: string | undefined
  let valueEn: string | undefined

  if (item.fileUrl) {
    /*
      Gated on the known extensions rather than uppercasing whatever the URL
      ends with — `resolveFileExtension` splits the whole URL, so a link with
      no extension in its last segment would otherwise publish a cardIntro
      built from the URL path.
    */
    const extension = resolveFileExtension(item.fileUrl)
    const label = FILE_CONTENT_TYPE_MAP[extension]
      ? extension.toUpperCase()
      : undefined
    valueIs = label
    valueEn = label
  } else if (item.externalUrl) {
    valueIs = EXTERNAL_LINK_LABEL_IS
    valueEn = EXTERNAL_LINK_LABEL_EN
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
  const tagId = resolveCategoryTagId(item)

  /*
    Backstop only — the category is checked in forms.service.ts before any
    asset or link entry is created, since `syncCreateOnly` resolves links
    before mapping and a skip here would otherwise orphan them. Kept because
    an entry created with an empty `filterTags` would only ever be visible
    with no filter selected, the target list having all 12 filters wired.
  */
  if (!tagId) return undefined

  const titleEn = resolveTitleEn(item)
  const slug = mapSlug(item)

  return generateGenericListItem({
    listId: genericListId,
    ownerTags: [LYFJASTOFNUN_OWNER_TAG],
    properties: {
      // Prefixed like the sibling jobs ("Leiðbeiningar: ", "Lyfjastofnun: ")
      // so these entries are identifiable in Contentful's entry list, which
      // mixes every organisation's content together.
      internalTitle: `Eyðublöð: ${item.title}`,
      title: mapLocalizedValue(item.title, titleEn),
      slug: mapLocalizedValue(slug, titleEn ? slugify(titleEn) : undefined),
      tagIds: [tagId],
      cardIntro: buildCardIntro(item),
      /*
        The English locale reuses the Icelandic asset/link. For downloads that
        is literally the same file. For external links, 3 of 23 point at
        ec.europa.eu (already English) and 3 at minar.serlyfjaskra.is
        (language-neutral); the remaining 17 point at Icelandic island.is
        service pages, which have a language switcher. Leaving the English side
        empty instead would strip the card's icon and route every English
        visitor to a detail page that has no content on it.
      */
      assetId: link.assetId,
      assetIdEn: link.assetId,
      externalLinkId: link.externalLinkId,
      externalLinkIdEn: link.externalLinkId,
    },
  })
}
