import { MetadataProps } from 'contentful-management'
import { EnergyGrantDto } from '../energyGrants/dto/energyGrant.dto'
import { formatCurrency, isDefined } from '@island.is/shared/utils'
import {
  LOCALE,
  PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
  EN_LOCALE,
  UOS_TAGS,
} from '../../constants'
import { CreationType } from './cms.types'

const uosMetadata: MetadataProps = {
  tags: [
    {
      sys: {
        type: 'Link',
        linkType: 'Tag',
        id: 'ownerOrkustofnun',
      },
    },
  ],
}

export const mapEnergyGrantToGenericListItem = (
  data: EnergyGrantDto,
): CreationType | undefined => {
  const tagIds = [
    UOS_TAGS[data.tagOne],
    data.tagTwo ? UOS_TAGS[data.tagTwo] : undefined,
    data.tagThree ? UOS_TAGS[data.tagThree] : undefined,
  ]
    .filter(isDefined)
    .map((tagId) => ({
      type: 'Link',
      linkType: 'Entry',
      id: tagId,
    }))

  const slug = data.projectName.toLocaleLowerCase(LOCALE).replace(/ /g, '')

  const newEntry: CreationType['fields'] = {
    fields: {
      genericList: {
        [LOCALE]: {
          sys: {
            id: PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
            linkType: 'Entry',
          },
        },
      },
      internalTitle: {
        [LOCALE]: data.projectName,
      },
      title: {
        [LOCALE]: data.projectName,
      },
      cardIntro: {
        [LOCALE]: {
          content: [
            {
              content: [
                {
                  value: data.initiativeName,
                  nodeType: 'text',
                },
              ],
              nodeType: 'paragraph',
            },
            {
              content: [
                {
                  data: {},
                  marks: [],
                  value: 'Styrkur: ',
                  nodeType: 'text',
                },
                {
                  marks: [{ type: 'bold' }],
                  value: formatCurrency(data.amount),
                  nodeType: 'text',
                },
                {
                  value: '\nStyrkhafi: ',
                  nodeType: 'text',
                },
                {
                  marks: [{ type: 'bold' }],
                  value: data.recipient,
                  nodeType: 'text',
                },
              ],
              nodeType: 'paragraph',
            },
          ],
          nodeType: 'document',
        },
      },
      slug: {
        [EN_LOCALE]: slug,
        [LOCALE]: slug,
      },
      content: {
        [EN_LOCALE]: {
          nodeType: 'document',
          content: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  value: 'Category name: ',
                  nodeType: 'text',
                },
                {
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  value:
                    'Innviðir fyrir rafknúin farartæki, skip og flugvélar\n',
                  nodeType: 'text',
                },
                {
                  value: 'Case number: ',
                  nodeType: 'text',
                },
                {
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  value: 'OS2024040109',
                  nodeType: 'text',
                },
              ],
            },
            {
              nodeType: 'paragraph',
              content: [
                {
                  value: 'Recipient: ',
                  nodeType: 'text',
                },
                {
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  value: 'Orkan IS ehf.\n',
                  nodeType: 'text',
                },
                {
                  value: 'Grant: ',
                  nodeType: 'text',
                },
                {
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  value: '22.800.000 kr.',
                  nodeType: 'text',
                },
              ],
            },
          ],
        },
        [LOCALE]: {
          nodeType: 'document',
          content: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  value: 'Heiti átaks: ',
                  nodeType: 'text',
                },
                {
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  value:
                    'Innviðir fyrir rafknúin farartæki, skip og flugvélar\n',
                  nodeType: 'text',
                },
                {
                  value: 'Málsnúmer: ',
                  nodeType: 'text',
                },
                {
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  value: 'OS2024040109',
                  nodeType: 'text',
                },
              ],
            },
            {
              nodeType: 'paragraph',
              content: [
                {
                  value: 'Styrkhafi: ',
                  nodeType: 'text',
                },
                {
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  value: 'Orkan IS ehf.\n',
                  nodeType: 'text',
                },
                {
                  value: 'Styrkur: ',
                  nodeType: 'text',
                },
                {
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  value: '22.800.000 kr.',
                  nodeType: 'text',
                },
              ],
            },
          ],
        },
      },
      filterTags: tagIds,
    },
  }
  return {
    fields: newEntry,
    metadata: uosMetadata,
  }
}
