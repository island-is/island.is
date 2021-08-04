import { Query } from '@island.is/api/schema'
import { useQuery, gql } from '@apollo/client'

// import { APPLICATION_APPLICATIONS } from '../../lib/queries/applicationApplications'

const RegulationDraftQuery = gql`
  query draftRegulations($input: GetDraftRegulationInput!) {
    getDraftRegulation(input: $input)
  }
`

// const res = useMockQuery(
//   draftId !== 'new' &&
//     !state.error && { regulationDraft: mockDraftRegulations[draftId] },
//   isNew,
// )
// // const res = useQuery<Query>(RegulationDraftQuery, {
// //   variables: { id: draftId },
// //   skip: isNew && !state.error,
// // })
// const { loading, error } = res

// const draft = res.data ? res.data.regulationDraft : undefined

export const useRegulationDraftQuery = (skip: boolean, draftId: string) => {
  const { loading, error, data } = useQuery<Query>(RegulationDraftQuery, {
    variables: {
      input: {
        regulationId: draftId,
      },
    },
    fetchPolicy: 'no-cache',
    skip: skip,
  })

  return {
    draft: data ? data.getDraftRegulation : undefined,
    loading,
    error,
  }
}
