import { useQuery } from '@apollo/client'
import { GetSingleEndorsement } from '../graphql/queries'
import { Endorsement } from '../types/schema'

interface EndorsementData {
  endorsementSystemUserEndorsements?: any
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
  return endorsement?.endorsementSystemUserEndorsements?.hasEndorsed
}
