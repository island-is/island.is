import { formatCurrency, isDefined } from '@island.is/shared/utils'
import { LOCALE, EN_LOCALE } from '../../constants'
import { CreationType } from '../cms/cms.types'
import { EnergyGrantDto } from './dto/energyGrant.dto'
import { generateGenericListItem } from '../cms/mapper'

const OWNER_TAG = 'owner-orkustofnun'

export const mapEnergyGrantToGenericListItem = (
  data: EnergyGrantDto,
  genericListId: string,
  tagsRegistry: Record<string, string>,
): CreationType | undefined =>
  generateGenericListItem({
    listId: genericListId,
    ownerTag: OWNER_TAG,
    properties: {
      internalTitle: data.projectName,
      title: data.projectName,
      slug: data.projectName.toLocaleLowerCase(LOCALE).replace(/ /g, ''),
      tagIds: [
        tagsRegistry[data.tagOne],
        data.tagTwo ? tagsRegistry[data.tagTwo] : undefined,
        data.tagThree ? tagsRegistry[data.tagThree] : undefined,
        tagsRegistry[data.year.toString()],
      ].filter(isDefined),
      cardIntro: {
        [LOCALE]: [
          {
            items: [
              {
                value: data.initiativeName,
              },
            ],
          },
          {
            items: [
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
        ],
        [EN_LOCALE]: [
          {
            items: [
              {
                value: data.initiativeName,
              },
            ],
          },
          {
            items: [
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
        ],
      },
      content: {
        [EN_LOCALE]: [
          {
            items: [
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
            items: [
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
        [LOCALE]: [
          {
            items: [
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
            items: [
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
      },
    },
  })
