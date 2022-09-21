import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildRadioField,
  getValueViaPath,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../../../lib/messages'
import { ABOUTIDS, GREATER, LESS, USERTYPE } from '../../../../lib/constants'
import { getCurrentUserType } from '../../../../lib/utils/helpers'

type Foo = {
  name: string
  value: string
}

export const electionInfoSection = buildSection({
  id: 'electionInfo',
  title: m.election,
  condition: (answers, externalData) =>
    getCurrentUserType(answers, externalData) === USERTYPE.INDIVIDUAL,
  children: [
    buildMultiField({
      id: 'election',
      title: m.election,
      description: m.fillOutAppopriate,
      children: [
        buildCustomField({
          id: 'election.availableElectionField',
          title: m.election,
          childInputIds: [ABOUTIDS.selectElection],
          component: 'AvailableElections',
        }),
        buildDescriptionField({
          id: 'election.electionDescription',
          title: m.campaignCost,
          titleVariant: 'h3',
          description: m.pleaseSelect,
          space: 5,
        }),
        buildRadioField({
          id: 'election.incomeLimit',
          title: '',
          options: [
            { value: LESS, label: m.lessThanLimit },
            { value: GREATER, label: m.moreThanLimit },
          ],
          width: 'full',
          largeButtons: true,
        }),
      ],
    }),
  ],
})
