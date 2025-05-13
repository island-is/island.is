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
      sys: {
        id: tagId,
        linkType: 'Entry',
      },
    }))

  const slug = data.projectName.toLocaleLowerCase(LOCALE).replace(/ /g, '')

  const newEntry: CreationType['fields'] = {
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
    filterTags: {
      [LOCALE]: tagIds,
    },
    title: {
      [LOCALE]: data.projectName,
    },
    cardIntro: {
      [LOCALE]: {
        data: {},
        content: [
          {
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value: data.initiativeName,
                nodeType: 'text',
              },
            ],
            nodeType: 'paragraph',
          },
          {
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value: 'Styrkur: ',
                nodeType: 'text',
              },
              {
                data: {},
                marks: [{ type: 'bold' }],
                value: formatCurrency(data.amount),
                nodeType: 'text',
              },
              {
                data: {},
                marks: [],
                value: '\nStyrkhafi: ',
                nodeType: 'text',
              },
              {
                data: {},
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
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value: 'Category name: ',
                nodeType: 'text',
              },
              {
                data: {},
                marks: [
                  {
                    type: 'bold',
                  },
                ],
                value: `${data.initiativeName}\n`,
                nodeType: 'text',
              },
              {
                data: {},
                marks: [],
                value: 'Case number: ',
                nodeType: 'text',
              },
              {
                data: {},
                marks: [
                  {
                    type: 'bold',
                  },
                ],
                value: data.caseId,
                nodeType: 'text',
              },
            ],
          },
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value: 'Recipient: ',
                nodeType: 'text',
              },
              {
                data: {},
                marks: [
                  {
                    type: 'bold',
                  },
                ],
                value: `${data.recipient}.\n`,
                nodeType: 'text',
              },
              {
                data: {},
                marks: [],
                value: 'Grant: ',
                nodeType: 'text',
              },
              {
                data: {},
                marks: [
                  {
                    type: 'bold',
                  },
                ],
                value: formatCurrency(data.amount),
                nodeType: 'text',
              },
            ],
          },
        ],
      },
      [LOCALE]: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value: 'Heiti átaks: ',
                nodeType: 'text',
              },
              {
                data: {},
                marks: [
                  {
                    type: 'bold',
                  },
                ],
                value: `${data.initiativeName}\n`,
                nodeType: 'text',
              },
              {
                data: {},
                marks: [],
                value: 'Málsnúmer: ',
                nodeType: 'text',
              },
              {
                data: {},
                marks: [
                  {
                    type: 'bold',
                  },
                ],
                value: data.caseId,
                nodeType: 'text',
              },
            ],
          },
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value: 'Styrkhafi: ',
                nodeType: 'text',
              },
              {
                data: {},
                marks: [
                  {
                    type: 'bold',
                  },
                ],
                value: `${data.recipient}.\n`,
                nodeType: 'text',
              },
              {
                data: {},
                marks: [],
                value: 'Styrkur: ',
                nodeType: 'text',
              },
              {
                data: {},
                marks: [
                  {
                    type: 'bold',
                  },
                ],
                value: formatCurrency(data.amount),
                nodeType: 'text',
              },
            ],
          },
        ],
      },
    },
  }
  return {
    fields: newEntry,
    metadata: uosMetadata,
  }
}
