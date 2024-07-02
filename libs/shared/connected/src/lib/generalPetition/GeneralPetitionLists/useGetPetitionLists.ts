import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { useState } from 'react'

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
        endorsementCounter
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
  const [pagination, setPagination] = useState({ after: '', before: '' })
  const { data, loading, error, fetchMore } = useQuery<PetitionListResponse>(
    GetGeneralPetitionLists,
    {
      variables: {
        input: {
          tags: 'generalPetition',
          after: pagination.after,
          before: pagination.before,
          limit: 10,
        },
      },
    },
  )

  const loadNextPage = () => {
    if (data?.endorsementSystemGetGeneralPetitionLists.pageInfo.hasNextPage) {
      setPagination({
        ...pagination,
        after: data.endorsementSystemGetGeneralPetitionLists.pageInfo.endCursor,
        before: '',
      })
      fetchMore({
        variables: {
          input: {
            tags: 'generalPetition',
            limit: 10,
            after:
              data.endorsementSystemGetGeneralPetitionLists.pageInfo.endCursor,
          },
        },
      })
    }
  }

  const loadPreviousPage = () => {
    if (
      data?.endorsementSystemGetGeneralPetitionLists.pageInfo.hasPreviousPage
    ) {
      setPagination({
        ...pagination,
        after: '',
        before:
          data.endorsementSystemGetGeneralPetitionLists.pageInfo.startCursor,
      })
      fetchMore({
        variables: {
          input: {
            tags: 'generalPetition',
            limit: 10,
            before:
              data.endorsementSystemGetGeneralPetitionLists.pageInfo
                .startCursor,
          },
        },
      })
    }
  }

  return {
    data: data?.endorsementSystemGetGeneralPetitionLists?.data ?? [],
    loading,
    error,
    loadNextPage,
    loadPreviousPage,
    pageInfo: data?.endorsementSystemGetGeneralPetitionLists.pageInfo,
  }
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
