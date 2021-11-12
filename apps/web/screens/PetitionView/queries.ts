import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

interface PetitionListResponse {
  endorsementSystemGetGeneralPetitionList: any
}

interface PetitionListEndorsementsResponse {
  endorsementSystemGetGeneralPetitionEndorsements: any
}

const GetGeneralPetitionList = gql`
  query endorsementSystemGetGeneralPetitionList(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetGeneralPetitionList(input: $input) {
      id
      title
      description
      closedDate
      meta
      created
      ownerName
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

export const useGetPetitionList = (listId: string) => {
  const {
    data: endorsementListsResponse,
    loading,
  } = useQuery<PetitionListResponse>(GetGeneralPetitionList, {
    variables: {
      input: {
        listId: listId,
      },
    },
  })

  const list =
    endorsementListsResponse?.endorsementSystemGetGeneralPetitionList ?? []
  return { list, loading }
}

export const useGetPetitionListEndorsements = (listId: string) => {
  const {
    data: endorsementListsResponse,
  } = useQuery<PetitionListEndorsementsResponse>(
    GetGeneralPetitionListEndorsements,
    {
      variables: {
        input: {
          listId: listId,
        },
      },
    },
  )

  return (
    endorsementListsResponse?.endorsementSystemGetGeneralPetitionEndorsements ??
    []
  )
}
