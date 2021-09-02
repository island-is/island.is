import { useQuery } from '@apollo/client'

import { GetSingleEndorsementList } from '../graphql/queries'
import { EndorsementList } from '../types/schema'

interface ExistsEndorsement {
  endorsementSystemGetSingleEndorsementList?: EndorsementList
}

export const useEndorsementListExists = (endorsementListId: string) => {
  const { data: endorsement } = useQuery<ExistsEndorsement>(
    GetSingleEndorsementList,
    {
      variables: {
        input: {
          listId: endorsementListId,
        },
      },
    },
  )

  return !!endorsement
}

