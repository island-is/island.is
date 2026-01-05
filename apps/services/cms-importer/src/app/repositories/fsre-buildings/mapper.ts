import { CreationType, RichTextParagraph } from '../cms/cms.types'
import { generateGenericListItem, mapLocalizedValue } from '../cms/mapper'
import { BuildingDto } from './dto/building.dto'
import slugify from '@sindresorhus/slugify'

const OWNER_TAG = 'ownerFsre'

export const mapFSREBuildingToGenericListItem = (
  data: BuildingDto,
  genericListId: string,
  tagsRegistry: Record<string, string>,
): CreationType | undefined => {
  const tagIds = data.region ? [tagsRegistry[data.region]] : undefined
  const slug = slugify(data.address, { separator: '-' })

  return generateGenericListItem({
    listId: genericListId,
    ownerTags: [OWNER_TAG],
    properties: {
      internalTitle: `FSRE: ${data.address}_${data.id}`,
      title: mapLocalizedValue(data.address, data.address),
      slug: mapLocalizedValue(slug, slug),
      tagIds,
      cardIntro: mapLocalizedValue(
        generateCardIntroForLocale(data, 'is'),
        generateCardIntroForLocale(data, 'en'),
      ),
      content: mapLocalizedValue(
        generateContentForLocale(data, 'is'),
        generateContentForLocale(data, 'en'),
      ),
    },
  })
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
  const content: Array<{ values: Array<{ value: string; isBold?: boolean }> }> =
    []

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
    const useLabel = locale === 'is' ? 'Starfssemi: ' : 'Function: '
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
