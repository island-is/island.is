import { Query } from '@island.is/api/schema'
import { useQuery, gql } from '@apollo/client'
import { RegulationDraft } from '@island.is/regulations/admin'
import { RegulationMinistry } from '@island.is/regulations/web'

// import { APPLICATION_APPLICATIONS } from '../../lib/queries/applicationApplications'

const RegulationDraftQuery = gql`
  query draftRegulations($input: GetDraftRegulationInput!) {
    getDraftRegulation(input: $input)
  }
`

const MinistriesQuery = gql`
  query DraftRegulationMinistriesQuery {
    getDraftRegulationsMinistries
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
  const { loading, error, data } = useQuery(RegulationDraftQuery, {
    variables: {
      input: {
        regulationId: draftId,
      },
    },
    fetchPolicy: 'no-cache',
    skip,
  })

  return {
    draft: data ? (data.getDraftRegulation as RegulationDraft) : undefined,
    loading,
    error,
  }
}

export const useMinistriesQuery = () => {
  const { loading, error, data } = useQuery<Query>(MinistriesQuery)

  return {
    ministries: data
      ? (data.getDraftRegulationsMinistries as ReadonlyArray<RegulationMinistry>)
      : undefined,
    loading,
    error,
  }
}
