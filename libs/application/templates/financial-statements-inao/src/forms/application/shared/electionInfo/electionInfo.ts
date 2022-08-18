import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildRadioField,
} from '@island.is/application/core'
import { m } from '../../../../lib/messages'
import { INDIVIDUAL, GREATER, LESS } from '../../../../lib/constants'

export const electionInfoSection = buildSection({
  id: 'electionInfo',
  title: m.election,
  condition: (_answers, externalData) =>
    /* @ts-ignore */
    externalData?.currentUserType?.data?.code === INDIVIDUAL,
  children: [
    buildMultiField({
      id: 'election',
      title: m.election,
      description: m.fillOutAppopriate,
      children: [
        buildSelectField({
          id: 'election.selectElection',
          title: m.election,
          width: 'half',
          placeholder: m.pickElectionType,
          options: [
            {
              label: m.presidentalElection,
              value: 'Forsetakosningar',
            },
            {
              label: m.parliamentaryElection,
              value: 'Alþingiskosningar',
            },
          ],
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
