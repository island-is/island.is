import {
  EntryCreationDto,
  EntryUpdateDto,
  Localized,
  RichTextParagraph,
  CmsRichTextDocument,
} from '../cms/cms.types'
import {
  generateGenericListItem,
  mapLocalizedValue,
  mapLocalizedRichTextDocument,
} from '../cms/mapper'
import { BuildingDto } from './dto/building.dto'
import slugify from '@sindresorhus/slugify'
import { Entry } from 'contentful-management'
import { EN_LOCALE, LOCALE } from '../../constants'
import { isDefined } from '@island.is/shared/utils'

const OWNER_TAG = 'ownerFsre'

export const mapEntryCreationDto = (
  data: BuildingDto,
  genericListId: string,
  tagsRegistry: Record<string, string>,
): EntryCreationDto | undefined => {
  const tagIds = data.region
    ? [tagsRegistry[data.region]].filter(isDefined)
    : undefined

  return generateGenericListItem({
    listId: genericListId,
    ownerTags: [OWNER_TAG],
    properties: mapCreationProperties(data, tagIds),
  })
}

export const mapEntryUpdateDto = (
  cmsEntry: Entry,
  data: BuildingDto,
): EntryUpdateDto | undefined => {
  const properties = mapUpdateProperties(data)
  const fields: Array<keyof typeof properties> = [
    'title',
    'slug',
    'cardIntro',
    'content',
  ]

  const createFieldMappings = (locale: string) =>
    fields.map((fieldKey) => ({
      key: fieldKey,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: (properties[fieldKey] as any)?.[locale],
    }))

  return {
    cmsEntry,
    inputFields: {
      [LOCALE]: createFieldMappings(LOCALE),
      [EN_LOCALE]: createFieldMappings(EN_LOCALE),
    },
  }
}

const generateCardIntroContent = (
  data: BuildingDto,
): Localized<Array<RichTextParagraph>> => ({
  [LOCALE]: generateCardIntroForLocale(data, 'is'),
  [EN_LOCALE]: generateCardIntroForLocale(data, 'en'),
})

const generateMainContent = (
  data: BuildingDto,
): Localized<Array<RichTextParagraph>> => ({
  [LOCALE]: generateContentForLocale(data, 'is'),
  [EN_LOCALE]: generateContentForLocale(data, 'en'),
})

const mapCreationProperties = (data: BuildingDto, tagIds?: string[]) => ({
  internalTitle: `FSRE: ${data.address}_${data.id}`,
  title: mapTitle(data),
  slug: mapSlug(data),
  tagIds,
  cardIntro: generateCardIntroContent(data),
  content: generateMainContent(data),
})

const mapUpdateProperties = (
  data: BuildingDto,
): {
  title: Localized<string>
  slug: Localized<string>
  cardIntro: Localized<CmsRichTextDocument>
  content: Localized<CmsRichTextDocument>
} => {
  const cardIntroContent = generateCardIntroContent(data)
  const mainContent = generateMainContent(data)

  return {
    title: mapTitle(data),
    slug: mapSlug(data),
    cardIntro: mapLocalizedRichTextDocument(
      cardIntroContent[LOCALE],
      cardIntroContent[EN_LOCALE],
    ),
    content: mapLocalizedRichTextDocument(
      mainContent[LOCALE],
      mainContent[EN_LOCALE],
    ),
  }
}

export const mapTitle = (data: BuildingDto): Localized<string> =>
  mapLocalizedValue(data.address, data.address)

export const mapSlug = (data: BuildingDto): Localized<string> => {
  const slug = slugify(`${data.address}-${data.id}`, { separator: '-' })
  return mapLocalizedValue(slug, slug)
}

const generateCardIntroForLocale = (
  data: BuildingDto,
  locale: 'is' | 'en',
): Array<RichTextParagraph> => {
  const cardIntro: Array<RichTextParagraph> = []

  if (data.municipality) {
    cardIntro.push({
      values: [{ value: data.municipality, isBold: true }],
    })
  }

  if (data.use) {
    if (locale === 'is') {
      const textIs = data.squareMeters
        ? `${data.use} (${data.squareMeters} fm)`
        : data.use
      cardIntro.push({
        values: [{ value: textIs }],
      })
    } else {
      const textEn = data.squareMeters
        ? `${data.use} (${data.squareMeters} sq.m)`
        : data.use
      cardIntro.push({
        values: [{ value: textEn }],
      })
    }
  }

  if (data.propertyManagement) {
    const label = locale === 'is' ? 'Eignastjórn: ' : 'Property Management: '
    cardIntro.push({
      values: [{ value: `${label}${data.propertyManagement.join(', ')}` }],
    })
  }

  return cardIntro
}

const generateContentForLocale = (
  data: BuildingDto,
  locale: 'is' | 'en',
): Array<RichTextParagraph> => {
  const content: Array<RichTextParagraph> = []

  if (data.municipality) {
    content.push({
      values: [{ value: data.municipality, isBold: true }],
    })
  }

  const idLabel = locale === 'is' ? 'Fastanúmer: ' : 'Id number: '
  content.push({
    values: [
      { value: idLabel },
      {
        value: data.id,
        isBold: true,
      },
    ],
  })

  if (data.squareMeters) {
    const areaLabel = locale === 'is' ? 'Stærð (fm): ' : 'Area (sq.m): '
    content.push({
      values: [
        { value: areaLabel },
        { value: data.squareMeters.toString(), isBold: true },
      ],
    })
  }

  if (data.built) {
    const builtLabel =
      locale === 'is' ? 'Byggingarár: ' : 'Year of construction: '
    content.push({
      values: [{ value: builtLabel }, { value: data.built, isBold: true }],
    })
  }

  if (data.use) {
    const useLabel = locale === 'is' ? 'Starfsemi: ' : 'Function: '
    content.push({
      values: [{ value: useLabel }, { value: data.use, isBold: true }],
    })
  }

  if (data.propertyManagement) {
    const propLabel =
      locale === 'is' ? 'Eignastjórn: ' : 'Property management: '
    content.push({
      values: [
        { value: propLabel },
        { value: data.propertyManagement.join(', '), isBold: true },
      ],
    })
  }

  if (data.accountManagement) {
    const accountLabel =
      locale === 'is' ? 'Viðskiptastjórn: ' : 'Account management: '
    content.push({
      values: [
        { value: accountLabel },
        { value: data.accountManagement.join(', '), isBold: true },
      ],
    })
  }

  return content
}
