import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

interface PetitionListResponse {
  endorsementSystemGetGeneralPetitionLists: any
}

interface PetitionListEndorsementsResponse {
  endorsementSystemGetGeneralPetitionEndorsements: any
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
        owner
      }
    }
  }
`

const GetGeneralPetitionListEndorsements = gql`
  query endorsementSystemGetGeneralPetitionEndorsements(
    $input: PaginatedEndorsementInput!
  ) {
    endorsementSystemGetGeneralPetitionEndorsements(input: $input) {
      totalCount
      data {
        id
        endorser
        created
        meta {
          fullName
        }
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

export const useGetPetitionListEndorsements = (listId: string) => {
  const { data: endorsementListsResponse } =
    useQuery<PetitionListEndorsementsResponse>(
      GetGeneralPetitionListEndorsements,
      {
        variables: {
          input: {
            listId: listId,
            limit: 1000,
          },
        },
      },
    )

  return (
    endorsementListsResponse?.endorsementSystemGetGeneralPetitionEndorsements ??
    []
  )
}
