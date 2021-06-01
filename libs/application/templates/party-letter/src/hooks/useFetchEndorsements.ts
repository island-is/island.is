import { useQuery } from '@apollo/client'

import { GetEndorsements } from '../graphql/queries'
import { Endorsement } from '../types/schema'

interface EndorsementData {
  endorsementSystemGetEndorsements?: Endorsement[]
}

export const useEndorsements = (
  endorsementListId: string,
  shouldPoll: boolean,
) => {
  const { data: endorsementsData } = useQuery<EndorsementData>(
    GetEndorsements,
    {
      variables: {
        input: {
          listId: endorsementListId,
        },
      },
      pollInterval: shouldPoll ? 20000 : 0,
    },
  )

  if (endorsementsData && endorsementsData.endorsementSystemGetEndorsements)
    return endorsementsData.endorsementSystemGetEndorsements
  else return undefined
}
