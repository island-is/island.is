import gql from 'graphql-tag'
import {
  EndorsementList,
  EndorsementListOpenTagsEnum,
  Endorsement,
  TemporaryVoterRegistry,
} from '../types/schema'

import { useQuery } from '@apollo/client'

export type RegionsPetitionList = Pick<
  EndorsementList,
  'id' | 'title' | 'description' | 'meta' | 'closedDate'
> & { tags: EndorsementListOpenTagsEnum[] }

export type UserEndorsement = Pick<
  Endorsement,
  'id' | 'created' | 'endorsementList'
>
export type UserVoterRegion = Pick<
  TemporaryVoterRegistry,
  'regionNumber' | 'regionName'
>

interface UserEndorsementsResponse {
  endorsementSystemUserEndorsements: UserEndorsement[]
}
interface PetitionListResponse {
  endorsementSystemFindEndorsementLists: RegionsPetitionList[]
}
interface SinglePetition {
  endorsementSystemGetSingleEndorsementList?: EndorsementList
}

const GET_USER_ENDORSEMENTS = gql`
  query endorsementSystemUserEndorsements {
    endorsementSystemUserEndorsements {
      id
      endorser
      endorsementList {
        id
        title
        description
        tags
        closedDate
      }
      meta {
        fullName
        address
      }
      created
      modified
    }
  }
`
const GET_REGION_ENDORSEMENTS = gql`
  query endorsementSystemFindEndorsementLists(
    $input: FindEndorsementListByTagsDto!
  ) {
    endorsementSystemFindEndorsementLists(input: $input) {
      id
      title
      description
      tags
      meta
      closedDate
    }
  }
`
export const GetSinglePetitionList = gql`
  query endorsementSystemGetSingleEndorsementList(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetSingleEndorsementList(input: $input) {
      meta
      title
      description
    }
  }
`
export const UnendorseList = gql`
  mutation unendorseList($input: FindEndorsementListInput!) {
    endorsementSystemUnendorseList(input: $input)
  }
`

export const EndorseList = gql`
  mutation endorsementSystemEndorseList($input: FindEndorsementListInput!) {
    endorsementSystemEndorseList(input: $input) {
      id
      endorser
      endorsementListId
      meta {
        fullName
      }
      created
      modified
    }
  }
`

export const useGetPetitionLists = () => {
  const { data: endorsementListsResponse } = useQuery<PetitionListResponse>(
    GET_REGION_ENDORSEMENTS,
    {
      variables: {
        input: {
          tags: 'partyLetter2021',
        },
      },
      pollInterval: 20000,
    },
  )

  return endorsementListsResponse?.endorsementSystemFindEndorsementLists ?? []
}

export const useGetUserLists = () => {
  const { data: endorsementResponse } = useQuery<UserEndorsementsResponse>(
    GET_USER_ENDORSEMENTS,
    {
      pollInterval: 20000,
    },
  )
  return endorsementResponse?.endorsementSystemUserEndorsements ?? []
}

export const useGetSinglePetition = (listId: string) => {
  const { data: petition } = useQuery<SinglePetition>(GetSinglePetitionList, {
    variables: {
      input: {
        listId: listId,
      },
    },
  })
  return petition?.endorsementSystemGetSingleEndorsementList
}

