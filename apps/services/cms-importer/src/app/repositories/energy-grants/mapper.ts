import { formatCurrency, isDefined } from '@island.is/shared/utils'
import {
  EntryCreationDto,
  EntryUpdateDto,
  Localized,
  RichTextParagraph,
  CmsRichTextDocument,
} from '../cms/cms.types'
import { EnergyGrantDto } from './dto/energyGrant.dto'
import {
  generateGenericListItem,
  mapLocalizedValue,
  mapLocalizedRichTextDocument,
} from '../cms/mapper'
import slugify from '@sindresorhus/slugify'
import { Entry } from 'contentful-management'
import { EN_LOCALE, LOCALE } from '../../constants'

const OWNER_TAGS = ['ownerOrkustofnun', 'ownerUmhverfisstofnun']

export const mapEntryCreationDto = (
  data: EnergyGrantDto,
  genericListId: string,
  tagsRegistry: Record<string, string>,
): EntryCreationDto | undefined => {
  const tagIds = [
    tagsRegistry[data.tagOne],
    data.tagTwo ? tagsRegistry[data.tagTwo] : undefined,
    data.tagThree ? tagsRegistry[data.tagThree] : undefined,
    tagsRegistry[data.year.toString()],
  ].filter(isDefined)

  return generateGenericListItem({
    listId: genericListId,
    ownerTags: OWNER_TAGS,
    properties: mapCreationProperties(data, tagIds),
  })
}

export const mapEntryUpdateDto = (
  cmsEntry: Entry,
  data: EnergyGrantDto,
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
  data: EnergyGrantDto,
): Localized<Array<RichTextParagraph>> => ({
  [LOCALE]: [
    {
      values: [
        { value: 'Styrkur: ' },
        { isBold: true, value: formatCurrency(data.amount) },
        { value: '\nStyrkhafi: ' },
        { isBold: true, value: data.recipient },
      ],
    },
    {
      values: [
        { value: 'Heiti átaks: ' },
        { isBold: true, value: data.initiativeName },
      ],
    },
  ],
  [EN_LOCALE]: [
    {
      values: [
        { value: 'Grant: ' },
        { isBold: true, value: formatCurrency(data.amount) },
        { value: '\nRecipient: ' },
        { isBold: true, value: data.recipient },
      ],
    },
    {
      values: [
        { value: 'Initiative: ' },
        { isBold: true, value: data.initiativeName },
      ],
    },
  ],
})

const generateMainContent = (
  data: EnergyGrantDto,
): Localized<Array<RichTextParagraph>> => ({
  [LOCALE]: [
    {
      values: [
        { value: 'Heiti átaks: ' },
        { isBold: true, value: `${data.initiativeName}\n` },
        { value: 'Málsnúmer: ' },
        { isBold: true, value: data.caseId },
      ],
    },
    {
      values: [
        { value: 'Styrkhafi: ' },
        { isBold: true, value: `${data.recipient}\n` },
        { value: 'Styrkur: ' },
        { isBold: true, value: formatCurrency(data.amount) },
      ],
    },
  ],
  [EN_LOCALE]: [
    {
      values: [
        { value: 'Category name: ' },
        { isBold: true, value: `${data.initiativeName}\n` },
        { value: 'Case number: ' },
        { isBold: true, value: data.caseId },
      ],
    },
    {
      values: [
        { value: 'Recipient: ' },
        { isBold: true, value: `${data.recipient}\n` },
        { value: 'Grant: ' },
        { isBold: true, value: formatCurrency(data.amount) },
      ],
    },
  ],
})

const mapCreationProperties = (
  data: EnergyGrantDto,
  tagIds?: string[],
): {
  internalTitle: string
  title: Localized<string>
  slug: Localized<string>
  tagIds?: string[]
  cardIntro: Localized<Array<RichTextParagraph>>
  content: Localized<Array<RichTextParagraph>>
} => ({
  internalTitle: data.projectName,
  title: mapTitle(data),
  slug: mapSlug(data),
  tagIds,
  cardIntro: generateCardIntroContent(data),
  content: generateMainContent(data),
})

const mapUpdateProperties = (
  data: EnergyGrantDto,
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

const mapTitle = (data: EnergyGrantDto): Localized<string> =>
  mapLocalizedValue(data.projectName, `Project: ${data.projectName}`)

const mapSlug = (data: EnergyGrantDto): Localized<string> => {
  const slug = slugify(`${data.projectName}-${data.caseId}`)
  return mapLocalizedValue(slug, slug)
}
