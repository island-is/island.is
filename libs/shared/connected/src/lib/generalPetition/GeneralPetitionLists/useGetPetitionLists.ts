import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

interface PetitionListResponse {
  endorsementSystemGetGeneralPetitionLists: any
}

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
        adminLock
        meta
      }
    }
  }
`

export const useGetPetitionLists = () => {
  const { data: endorsementListsResponse } = useQuery<PetitionListResponse>(
    GetGeneralPetitionLists,
    {
      variables: {
        input: {
          limit: 20,
        },
      },
      pollInterval: 20000,
    },
  )

  return (
    endorsementListsResponse?.endorsementSystemGetGeneralPetitionLists ?? []
  )
}
