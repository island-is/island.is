import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

const GetGeneralPetitionLists = gql`
  query endorsementSystemGetGeneralPetitionLists(
    $input: EndorsementPaginationInput!
  ) {
    endorsementSystemGetGeneralPetitionLists(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        title
        description
        closedDate
        openedDate
        endorsementCounter
        adminLock
        meta
        owner
      }
    }
  }
`

export const useGetPetitionLists = () => {
  const { data, loading } = useQuery(GetGeneralPetitionLists, {
    variables: {
      input: {
        tags: 'generalPetition',
        limit: 1000,
      },
    },
  })

  return {
    data: data?.endorsementSystemGetGeneralPetitionLists?.data ?? [],
    loading,
  }
}
