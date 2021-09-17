import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import {
  EndorsementList,
  EndorsementListOpenTagsEnum,
} from '../../types/schema'

export type RegionsPetitionList = Pick<
  EndorsementList,
  'id' | 'title' | 'description' | 'meta' | 'closedDate'
> & { tags: EndorsementListOpenTagsEnum[] }

interface PetitionListResponse {
  endorsementSystemFindEndorsementLists: RegionsPetitionList[]
}

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
