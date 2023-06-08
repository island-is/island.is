import { useQuery } from '@apollo/client'
import {
  EndorsementListsUserOwns,
  GetAllEndorsementsLists,
  GetEndorsements,
  GetListsUserSigned,
  GetSingleEndorsement,
  GetSinglePetitionList,
} from './queries'
import {
  EndorsementList,
  ExistsEndorsementResponse,
  PaginatedEndorsementListResponse,
  PaginatedEndorsementResponse,
} from '@island.is/api/schema'

interface UserSignedLists {
  endorsementSystemUserEndorsements: PaginatedEndorsementResponse
}
interface UserOwnsLists {
  endorsementSystemUserEndorsementLists: PaginatedEndorsementListResponse
}
interface PetitionLists {
  endorsementSystemFindEndorsementLists: PaginatedEndorsementListResponse
}
interface SinglePetition {
  endorsementSystemGetSingleEndorsementList?: EndorsementList
}
interface SinglePetitionEndorsements {
  endorsementSystemGetEndorsements?: PaginatedEndorsementResponse
}
interface SingleEndorsement {
  endorsementSystemGetSingleEndorsement?: ExistsEndorsementResponse
}

export const useGetAllPetitionLists = () => {
  const { data: endorsementListsResponse } = useQuery<PetitionLists>(
    GetAllEndorsementsLists,
    {
      variables: {
        input: {
          tags: 'generalPetition',
          limit: 1000,
        },
      },
      pollInterval: 20000,
    },
  )

  return endorsementListsResponse?.endorsementSystemFindEndorsementLists ?? []
}

export const useGetListsUserSigned = () => {
  const { data: endorsementResponse } = useQuery<UserSignedLists>(
    GetListsUserSigned,
    {
      variables: {
        input: {
          limit: 1000,
        },
      },
      pollInterval: 20000,
    },
  )
  return endorsementResponse?.endorsementSystemUserEndorsements ?? []
}

export const useListsUserOwns = () => {
  const { data: endorsementResponse } = useQuery<UserOwnsLists>(
    EndorsementListsUserOwns,
    {
      variables: {
        input: {
          tags: 'generalPetition',
          limit: 1000,
        },
      },
      pollInterval: 20000,
    },
  )
  return endorsementResponse?.endorsementSystemUserEndorsementLists ?? []
}

export const useGetSinglePetition = (listId: string) => {
  const { data: petition, refetch: refetchSinglePetition } =
    useQuery<SinglePetition>(GetSinglePetitionList, {
      variables: {
        input: {
          listId: listId,
        },
      },
    })

  const petitionData = petition?.endorsementSystemGetSingleEndorsementList ?? {}
  return { petitionData, refetchSinglePetition }
}

export const useGetSingleEndorsement = (listId: string) => {
  const { data: endorsement } = useQuery<SingleEndorsement>(
    GetSingleEndorsement,
    {
      variables: {
        input: {
          listId: listId,
        },
      },
      pollInterval: 20000,
    },
  )
  return endorsement?.endorsementSystemGetSingleEndorsement?.hasEndorsed
}

export const useGetSinglePetitionEndorsements = (listId: string) => {
  const { data: endorsements, refetch: refetchSinglePetitionEndorsements } =
    useQuery<SinglePetitionEndorsements>(GetEndorsements, {
      variables: {
        input: {
          listId: listId,
          limit: 1000,
        },
      },
      pollInterval: 20000,
    })

  const petitionEndorsements =
    endorsements?.endorsementSystemGetEndorsements ?? []
  return { petitionEndorsements, refetchSinglePetitionEndorsements }
}
