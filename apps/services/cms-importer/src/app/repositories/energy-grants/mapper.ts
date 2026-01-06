import { formatCurrency, isDefined } from '@island.is/shared/utils'
import { EntryCreationDto, EntryUpdateDto, Localized } from '../cms/cms.types'
import { EnergyGrantDto } from './dto/energyGrant.dto'
import { generateGenericListItem, mapLocalizedValue } from '../cms/mapper'
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
    properties: mapProperties(data, tagIds),
  })
}

export const mapEntryUpdateDto = (
  cmsEntry: Entry,
  data: EnergyGrantDto,
): EntryUpdateDto | undefined => {
  const properties = mapProperties(data)
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

const mapProperties = (data: EnergyGrantDto, tagIds?: string[]) => ({
  internalTitle: data.projectName,
  title: mapTitle(data),
  slug: mapSlug(data),
  tagIds,
  cardIntro: mapLocalizedValue(
    [
      {
        values: [
          {
            value: 'Styrkur: ',
          },
          {
            isBold: true,
            value: formatCurrency(data.amount),
          },
          { value: '\nStyrkhafi: ' },
          {
            isBold: true,
            value: data.recipient,
          },
        ],
      },
      {
        values: [
          {
            value: 'Heiti átaks: ',
          },
          {
            isBold: true,
            value: data.initiativeName,
          },
        ],
      },
    ],
    [
      {
        values: [
          {
            value: 'Grant: ',
          },
          {
            isBold: true,
            value: formatCurrency(data.amount),
          },
          { value: '\nRecipient: ' },
          {
            isBold: true,
            value: data.recipient,
          },
        ],
      },
      {
        values: [
          {
            value: 'Initiative: ',
          },
          {
            isBold: true,
            value: data.initiativeName,
          },
        ],
      },
    ],
  ),
  content: mapLocalizedValue(
    [
      {
        values: [
          {
            value: 'Heiti átaks: ',
          },
          {
            isBold: true,
            value: `${data.initiativeName}\n`,
          },
          {
            value: 'Málsnúmer: ',
          },
          {
            isBold: true,
            value: data.caseId,
          },
        ],
      },
      {
        values: [
          {
            value: 'Styrkhafi: ',
          },
          {
            isBold: true,
            value: `${data.recipient}\n`,
          },
          {
            value: 'Styrkur: ',
          },
          {
            isBold: true,
            value: formatCurrency(data.amount),
          },
        ],
      },
    ],
    [
      {
        values: [
          {
            value: 'Category name: ',
          },
          {
            isBold: true,
            value: `${data.initiativeName}\n`,
          },
          {
            value: 'Case number: ',
          },
          {
            isBold: true,
            value: data.caseId,
          },
        ],
      },
      {
        values: [
          {
            value: 'Recipient: ',
          },
          {
            isBold: true,
            value: `${data.recipient}\n`,
          },
          {
            value: 'Grant: ',
          },
          {
            isBold: true,
            value: formatCurrency(data.amount),
          },
        ],
      },
    ],
  ),
})

const mapTitle = (data: EnergyGrantDto): Localized<string> =>
  mapLocalizedValue(data.projectName, `Project: ${data.projectName}`)

const mapSlug = (data: EnergyGrantDto): Localized<string> => {
  const slug = slugify(`${data.projectName}-${data.caseId}`)
  return mapLocalizedValue(slug, slug)
}
