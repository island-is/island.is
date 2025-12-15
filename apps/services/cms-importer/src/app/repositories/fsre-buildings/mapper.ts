import { LOCALE, EN_LOCALE } from '../../constants'
import { CreationType, LocalizedContent } from '../cms/cms.types'
import { generateGenericListItem } from '../cms/mapper'
import { BuildingDto } from './dto/building.dto'

const OWNER_TAG = 'ownerFsre'

export const mapFSREBuildingToGenericListItem = (
  data: BuildingDto,
  genericListId: string,
  tagsRegistry: Record<string, string>,
): CreationType | undefined => {
  const tagIds = data.region ? [tagsRegistry[data.region]] : undefined

  return generateGenericListItem({
    listId: genericListId,
    ownerTag: OWNER_TAG,
    properties: {
      internalTitle: `FSRE: ${data.address}_${data.id}`,
      title: data.address,
      slug: data.address.toLocaleLowerCase(LOCALE).replace(/\s+/g, '-'),
      tagIds,
      cardIntro: generateCardIntro(data),
      content: generateContent(data),
    },
  })
}

const generateCardIntro = (data: BuildingDto): LocalizedContent => {
  const cardIntro: LocalizedContent = {
    [LOCALE]: [],
    [EN_LOCALE]: [],
  }

  if (data.municipality) {
    cardIntro[LOCALE].push({
      items: [{ value: data.municipality, isBold: true }],
    })
    cardIntro[EN_LOCALE].push({
      items: [{ value: data.municipality, isBold: true }],
    })
  }

  if (data.use) {
    const textIs = data.squareMeters
      ? `${data.use} (${data.squareMeters} fm)`
      : data.use
    const textEn = data.squareMeters ? `(${data.squareMeters} sq.m)` : undefined

    cardIntro[LOCALE].push({
      items: [{ value: textIs }],
    })
    if (textEn) {
      cardIntro[EN_LOCALE].push({
        items: [{ value: textEn }],
      })
    }
  }

  if (data.propertyManagement) {
    cardIntro[LOCALE].push({
      items: [{ value: `Eignastjórn: ${data.propertyManagement.join(', ')}` }],
    })
    cardIntro[EN_LOCALE].push({
      items: [
        {
          value: `Property Management: ${data.propertyManagement.join(', ')}`,
        },
      ],
    })
  }

  return cardIntro
}

const generateContent = (data: BuildingDto): LocalizedContent => {
  const content: LocalizedContent = {
    [LOCALE]: [],
    [EN_LOCALE]: [],
  }

  if (data.municipality) {
    content[LOCALE].push({
      items: [{ value: data.municipality, isBold: true }],
    })
    content[EN_LOCALE].push({
      items: [{ value: data.municipality, isBold: true }],
    })
  }

  content[LOCALE].push({
    items: [{ value: `Fastanúmer: ${data.id}` }],
  })
  content[EN_LOCALE].push({
    items: [{ value: `ID number: ${data.id}` }],
  })

  if (data.squareMeters) {
    content[LOCALE].push({
      items: [
        { value: 'Stærð (fm): ' },
        { value: data.squareMeters.toString(), isBold: true },
      ],
    })
    content[EN_LOCALE].push({
      items: [
        { value: 'Area (sq.m): ' },
        { value: data.squareMeters.toString(), isBold: true },
      ],
    })
  }

  if (data.built) {
    content[LOCALE].push({
      items: [{ value: 'Byggingarár: ' }, { value: data.built, isBold: true }],
    })
    content[EN_LOCALE].push({
      items: [
        { value: 'Year of construction: ' },
        { value: data.built, isBold: true },
      ],
    })
  }

  if (data.use) {
    content[LOCALE].push({
      items: [{ value: 'Starfssemi: ' }, { value: data.use, isBold: true }],
    })
    content[EN_LOCALE].push({
      items: [{ value: 'Function: ' }, { value: data.use, isBold: true }],
    })
  }

  if (data.propertyManagement) {
    content[LOCALE].push({
      items: [
        { value: 'Eignastjórn: ' },
        { value: data.propertyManagement.join(', '), isBold: true },
      ],
    })
    content[EN_LOCALE].push({
      items: [
        { value: 'Property management: ' },
        { value: data.propertyManagement.join(', '), isBold: true },
      ],
    })
  }

  if (data.accountManagement) {
    content[LOCALE].push({
      items: [
        { value: 'Viðskiptastjórn: ' },
        { value: data.accountManagement.join(', '), isBold: true },
      ],
    })
    content[EN_LOCALE].push({
      items: [
        { value: 'Account management: ' },
        { value: data.accountManagement.join(', '), isBold: true },
      ],
    })
  }

  return content
}
