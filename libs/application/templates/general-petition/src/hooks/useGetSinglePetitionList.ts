import { useQuery } from '@apollo/client'
import { GetSingleEndorsementList } from '../graphql/queries'
import { EndorsementList } from '../types/schema'

interface SingleList {
  endorsementSystemGetSingleEndorsementList?: EndorsementList
}

export const useGetSinglePetitionList = (listId: string) => {
  const {
    data: petition,
    refetch: refetchSinglePetition,
  } = useQuery<SingleList>(GetSingleEndorsementList, {
    variables: {
      input: {
        listId: listId,
      },
    },
  })

  const petitionData = petition?.endorsementSystemGetSingleEndorsementList ?? {}
  return { petitionData, refetchSinglePetition }
}
