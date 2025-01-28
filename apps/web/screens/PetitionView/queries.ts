import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

import {
  EndorsementList,
  PaginatedEndorsementResponse,
} from '@island.is/web/graphql/schema'

import { pageSize } from './utils'

const GetGeneralPetitionList = gql`
  query endorsementSystemGetGeneralPetitionList(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetGeneralPetitionList(input: $input) {
      id
      title
      description
      closedDate
      openedDate
      meta
      created
      ownerName
      owner
    }
  }
`

const GetGeneralPetitionListEndorsements = gql`
  query endorsementSystemGetGeneralPetitionEndorsements(
    $input: PaginatedEndorsementInput!
  ) {
    endorsementSystemGetGeneralPetitionEndorsements(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        endorser
        created
        meta {
          fullName
          locality
        }
      }
    }
  }
`

export const useGetPetitionList = (listId: string) => {
  const {
    data: endorsementListsResponse,
    loading,
    error,
  } = useQuery(GetGeneralPetitionList, {
    variables: {
      input: {
        listId: listId,
      },
    },
  })

  const list =
    (endorsementListsResponse?.endorsementSystemGetGeneralPetitionList as EndorsementList) ??
    []
  return { list, loading, error }
}

export const useGetPetitionListEndorsements = (
  listId: string,
  cursor?: string,
  pageDirection?: 'before' | 'after' | '',
) => {
  const {
    data: endorsementListsResponse,
    loading: loadingEndorsements,
    refetch,
  } = useQuery(GetGeneralPetitionListEndorsements, {
    variables: {
      input: {
        before: pageDirection === 'before' ? cursor : '',
        after: pageDirection === 'after' ? cursor : '',
        listId: listId,
        limit: pageSize,
      },
    },
  })

  return {
    listEndorsements:
      (endorsementListsResponse?.endorsementSystemGetGeneralPetitionEndorsements as PaginatedEndorsementResponse) ??
      [],
    loadingEndorsements,
    refetch,
  }
}
