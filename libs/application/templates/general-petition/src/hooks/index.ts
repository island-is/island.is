import { useQuery } from '@apollo/client'
import { GetSingleEndorsement, GetSingleEndorsementList } from '../graphql'
import {
  Endorsement,
  EndorsementList,
  ExistsEndorsementResponse,
} from '@island.is/api/schema'

interface EndorsementData {
  endorsementSystemGetEndorsements?: Endorsement[]
}

interface SingleList {
  endorsementSystemGetSingleEndorsementList?: EndorsementList
}

interface EndorsementData {
  endorsementSystemGetSingleEndorsement?: ExistsEndorsementResponse
}

export const useGetSinglePetitionList = (listId: string) => {
  const { data: petition, refetch: refetchSinglePetition } =
    useQuery<SingleList>(GetSingleEndorsementList, {
      variables: {
        input: {
          listId: listId,
        },
      },
    })

  const petitionData = petition?.endorsementSystemGetSingleEndorsementList ?? {}
  return { petitionData, refetchSinglePetition }
}

export const useHasSigned = (listId: string) => {
  const { data: endorsement } = useQuery<EndorsementData>(
    GetSingleEndorsement,
    {
      variables: {
        input: {
          listId: listId,
        },
      },
    },
  )

  return endorsement?.endorsementSystemGetSingleEndorsement?.hasEndorsed
}
