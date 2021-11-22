import { useQuery } from '@apollo/client'
import { GetSingleEndorsement } from '../graphql/queries'
import { ExistsEndorsementResponse } from '../types/schema'

interface EndorsementData {
  endorsementSystemGetSingleEndorsement?: ExistsEndorsementResponse
}

//returns user endorsement if it exists
export const useHasEndorsed = (endorsementListId: string) => {
  const { data: endorsement } = useQuery<EndorsementData>(
    GetSingleEndorsement,
    {
      variables: {
        input: {
          listId: endorsementListId,
        },
      },
    },
  )

  return endorsement?.endorsementSystemGetSingleEndorsement?.hasEndorsed
}
