import {
  buildMultiField,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../../../lib/messages'
import { ABOUTIDS } from '../../../../lib/constants'
import { getCurrentUserType } from '../../../../lib/utils/helpers'
import { FSIUSERTYPE } from '../../../../types'

export const electionInfoSection = buildSection({
  id: 'electionInfo',
  title: m.election,
  condition: (answers, externalData) =>
    getCurrentUserType(answers, externalData) === FSIUSERTYPE.INDIVIDUAL,
  children: [
    buildMultiField({
      id: 'election',
      title: m.election,
      description: m.fillOutAppopriate,
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
