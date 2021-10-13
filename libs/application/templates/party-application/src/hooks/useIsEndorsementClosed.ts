import { useQuery } from '@apollo/client'

import { GetSingleEndorsementList } from '../graphql/queries'
import { EndorsementList } from '../types/schema'

interface ClosedEndorsements {
  endorsementSystemGetSingleEndorsementList?: EndorsementList
}

export const useIsClosed = (endorsementListId: string) => {
  const { data: endorsement } = useQuery<ClosedEndorsements>(
    GetSingleEndorsementList,
    {
      variables: {
        input: {
          listId: endorsementListId,
        },
      },
    },
  )
  const closedDate = endorsement?.endorsementSystemGetSingleEndorsementList?.closedDate
  return closedDate ? new Date(closedDate) > new Date() : true
}
