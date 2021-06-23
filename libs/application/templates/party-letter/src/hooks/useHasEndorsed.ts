import { useQuery } from '@apollo/client'

import { GetUserEndorsements } from '../graphql/queries'
import { Endorsement, EndorsementListTagsEnum } from '../types/schema'

const partyLetterTag = EndorsementListTagsEnum['PartyLetter2021']

interface EndorsementData {
  endorsementSystemUserEndorsements?: Endorsement[]
}

export const useHasEndorsed = (endorsementListId: string) => {
  const { data: endorsementsData, loading } = useQuery<EndorsementData>(
    GetUserEndorsements,
    {
      variables: {
        input: {
          tags: [partyLetterTag],
        },
      },
    },
  )

  const endorsements = endorsementsData?.endorsementSystemUserEndorsements
  return (
    endorsements?.some((x) => x.endorsementListId === endorsementListId) ??
    false
  )
}
