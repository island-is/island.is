import {
  buildMultiField,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { ABOUTIDS } from '../../../utils/constants'

export const electionInfoSection = buildSection({
  id: 'electionInfo',
  title: m.election,
  children: [
    buildMultiField({
      id: 'election',
      title: m.election,
      description: m.fillOutElectionInfo,
      children: [
        buildCustomField({
          id: 'election.availableElectionField',
          title: m.election,
          childInputIds: [ABOUTIDS.selectElection, ABOUTIDS.incomeLimit],
          component: 'ElectionsInfoFields',
        }),
      ],
    }),
  ],
})
