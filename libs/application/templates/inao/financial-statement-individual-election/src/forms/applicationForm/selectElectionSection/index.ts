import {
  buildMultiField,
  buildSection,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { Election } from '../../../types/types'

export const selectElectionSection = buildSection({
  id: 'selectElection',
  title: m.election,
  children: [
    buildMultiField({
      id: 'election',
      title: m.election,
      description: m.fillOutElectionInfo,
      children: [
        buildSelectField({
          id: 'election.electionId',
          title: m.election,
          setOnChange: async (optionValue, application) => {
            const elections = getValueViaPath<Array<Election>>(
              application.externalData,
              'fetchElections.data',
            )
            return [
              {
                key: 'election.genitiveName',
                value:
                  elections?.find(
                    (election) => election.electionId === optionValue,
                  )?.genitiveName ?? '',
              },
            ]
          },
          options: (application) => {
            const elections = getValueViaPath<Array<Election>>(
              application.externalData,
              'fetchElections.data',
            )

            if (!elections) {
              return []
            }

            return elections.map((election) => ({
              value: election.electionId,
              label: election.name,
            }))
          },
        }),
      ],
    }),
  ],
})
