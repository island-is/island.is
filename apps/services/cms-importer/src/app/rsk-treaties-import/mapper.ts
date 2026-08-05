import slugify from '@sindresorhus/slugify'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { EN_LOCALE, LOCALE } from '../constants'
import {
  EntryCreationDto,
  Localized,
  RichTextParagraph,
} from '../repositories/cms/cms.types'
import {
  generateGenericListItem,
  mapLocalizedValue,
} from '../repositories/cms/mapper'
import {
  RskTreatyLinkKind,
  RskTreatyTabKey,
} from '../repositories/rsk-treaties/dto/rskTreaty.dto'
import {
  GENERIC_LIST_ID,
  OWNER_TAG,
  TAG_IDS,
  TAB_KEY_DOCUMENT_TYPE_LABELS,
  TAB_KEY_TITLE_PRIORITY,
} from './constants'

export interface ResolvedRskLink {
  kind: RskTreatyLinkKind
  label: string
  resolved:
    | { type: 'asset'; assetId: string }
    // Raw external URL, embedded directly as a hyperlink node — used in the
    // CONTENT (rich text) shape only.
    | { type: 'hyperlink'; url: string }
    // A `linkUrl` Entry id — used for the SIMPLE shape's `externalLink`
    // field only, which points at an Entry rather than a bare URL.
    | { type: 'externalLinkEntry'; entryId: string }
}

export interface ResolvedRskDocument {
  label?: string
  links: ResolvedRskLink[]
}

export interface ResolvedRskItem {
  name: string
  tabKeys: RskTreatyTabKey[]
  documents: ResolvedRskDocument[]
}

const COUNTRY_NAME_EN_BY_IS = new Map(
  getAllCountryCodes()
    .filter((country) => country.name_is)
    .map((country) => [country.name_is as string, country.name]),
)

// Falls back to the Icelandic name itself for entries that aren't single
// countries (e.g. "Norðurlöndin", "OECD"), which aren't in the country list.
const getEnglishCountryName = (nameIs: string): string =>
  COUNTRY_NAME_EN_BY_IS.get(nameIs) ?? nameIs

export const isSimpleShape = (item: {
  documents: Array<{ links: Array<{ kind: RskTreatyLinkKind }> }>
}): boolean =>
  item.documents.length === 1 &&
  item.documents[0].links.every((link) => link.kind === 'is' || link.kind === 'en')

export const mapSlug = (nameIs: string): Localized<string> =>
  mapLocalizedValue(
    slugify(nameIs, { separator: '-' }),
    slugify(getEnglishCountryName(nameIs), { separator: '-' }),
  )

const getPrimaryTabKey = (tabKeys: RskTreatyTabKey[]): RskTreatyTabKey =>
  TAB_KEY_TITLE_PRIORITY.find((key) => tabKeys.includes(key)) ?? tabKeys[0]

const mapTitle = (item: ResolvedRskItem): Localized<string> =>
  mapLocalizedValue(item.name, getEnglishCountryName(item.name))

export const mapEntryCreationDto = (
  item: ResolvedRskItem,
): EntryCreationDto | undefined => {
  const tagIds = Array.from(new Set(item.tabKeys.map((key) => TAG_IDS[key])))

  return generateGenericListItem({
    listId: GENERIC_LIST_ID,
    ownerTags: [OWNER_TAG],
    properties: {
      internalTitle: `Skatturinn: ${item.name} - ${
        TAB_KEY_DOCUMENT_TYPE_LABELS[getPrimaryTabKey(item.tabKeys)]
      }`,
      title: mapTitle(item),
      slug: mapSlug(item.name),
      tagIds,
      ...(isSimpleShape(item)
        ? mapSimpleLinkProperties(item.documents[0])
        : { content: mapContentField(item.documents) }),
    },
  })
}

const mapSimpleLinkProperties = (document: ResolvedRskDocument) => {
  const isLink = document.links.find((link) => link.kind === 'is')
  const enLink = document.links.find((link) => link.kind === 'en')

  if (!isLink) {
    return {}
  }

  if (isLink.resolved.type === 'asset') {
    if (enLink && enLink.resolved.type !== 'asset') {
      // Kind mismatch between locales (rare) — keep the Icelandic asset only,
      // rather than silently dropping the asset field or mixing field types.
      return { assetId: mapLocalizedValue(isLink.resolved.assetId) }
    }
    return {
      assetId: mapLocalizedValue(
        isLink.resolved.assetId,
        enLink?.resolved.type === 'asset' ? enLink.resolved.assetId : undefined,
      ),
    }
  }

  if (isLink.resolved.type !== 'externalLinkEntry') {
    return {}
  }

  if (enLink && enLink.resolved.type !== 'externalLinkEntry') {
    return { externalLinkId: mapLocalizedValue(isLink.resolved.entryId) }
  }
  return {
    externalLinkId: mapLocalizedValue(
      isLink.resolved.entryId,
      enLink?.resolved.type === 'externalLinkEntry'
        ? enLink.resolved.entryId
        : undefined,
    ),
  }
}

const mapContentField = (
  documents: Array<ResolvedRskDocument>,
): Localized<Array<RichTextParagraph>> => {
  const paragraphs = buildContentParagraphs(documents)
  return {
    [LOCALE]: paragraphs,
    [EN_LOCALE]: paragraphs,
  }
}

const buildContentParagraphs = (
  documents: Array<ResolvedRskDocument>,
): Array<RichTextParagraph> => {
  const paragraphs: Array<RichTextParagraph> = []

  for (const document of documents) {
    if (document.label) {
      paragraphs.push({
        values: [{ value: `${document.label}:`, isBold: true }],
      })
    }

    for (const link of document.links) {
      if (link.resolved.type === 'externalLinkEntry') {
        // Should never occur in the CONTENT shape — externalLinkEntry is only
        // produced for the SIMPLE shape's externalLink field.
        continue
      }
      paragraphs.push({
        values: [
          {
            value: `á ${link.label}`,
            link:
              link.resolved.type === 'asset'
                ? { type: 'asset-hyperlink', assetId: link.resolved.assetId }
                : { type: 'hyperlink', uri: link.resolved.url },
          },
        ],
      })
    }
  }

  return paragraphs
}
