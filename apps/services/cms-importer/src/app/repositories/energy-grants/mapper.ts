import { formatCurrency, isDefined } from '@island.is/shared/utils'
import { CreationType } from '../cms/cms.types'
import { EnergyGrantDto } from './dto/energyGrant.dto'
import { generateGenericListItem, mapLocalizedValue } from '../cms/mapper'
import slugify from '@sindresorhus/slugify'

const OWNER_TAGS = ['ownerOrkustofnun', 'ownerUmhverfisstofnun']

export const mapEnergyGrantToGenericListItem = (
  data: EnergyGrantDto,
  genericListId: string,
  tagsRegistry: Record<string, string>,
): CreationType | undefined => {
  const slug = slugify(`${data.projectName}-${data.caseId}`)
  return generateGenericListItem({
    listId: genericListId,
    ownerTags: OWNER_TAGS,
    properties: {
      internalTitle: data.projectName,
      title: mapLocalizedValue(
        data.projectName,
        `Project: ${data.projectName}`,
      ),
      slug: mapLocalizedValue(slug, slug),
      tagIds: [
        tagsRegistry[data.tagOne],
        data.tagTwo ? tagsRegistry[data.tagTwo] : undefined,
        data.tagThree ? tagsRegistry[data.tagThree] : undefined,
        tagsRegistry[data.year.toString()],
      ].filter(isDefined),
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
    },
  })
}
