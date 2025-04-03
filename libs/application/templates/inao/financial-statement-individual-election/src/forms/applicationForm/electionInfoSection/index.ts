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
        // buildAsyncSelectField({
        //   id: 'election.availableElectionField',
        //   title: m.election,
        //   placeholder: m.pickElectionType,
        //   loadingError: 'Loading error',
        //   loadOptions: async ({ apolloClient }) => {
        //     const { data } = await apolloClient.query<ElectionsResponse>({
        //       query: getAvailableElections,
        //     })

        //     return (
        //       data?.financialStatementsInaoElections?.map((election) => ({
        //         value: election.electionId,
        //         label: election.name,
        //       })) ?? []
        //     )
        //   },
        //   marginBottom: 2,
        // }),
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
