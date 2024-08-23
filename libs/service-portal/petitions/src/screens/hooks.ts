import { useQuery } from '@apollo/client'
import {
  EndorsementListsUserOwns,
  GetAllEndorsementsLists,
  GetEndorsements,
  GetListsUserSigned,
  GetSingleEndorsement,
  GetSinglePetitionList,
} from './queries'
import { pageSize } from '../lib/utils'

export const useGetAllPetitionLists = () => {
  const { data: endorsementListsResponse } = useQuery(GetAllEndorsementsLists, {
    variables: {
      input: {
        tags: 'generalPetition',
        limit: 1000,
      },
    },
  })

  return endorsementListsResponse?.endorsementSystemFindEndorsementLists ?? []
}

export const useGetListsUserSigned = () => {
  const { data: endorsementResponse } = useQuery(GetListsUserSigned, {
    variables: {
      input: {
        tags: 'generalPetition',
        limit: 1000,
      },
    },
  })
  return endorsementResponse?.endorsementSystemUserEndorsements ?? []
}

export const useListsUserOwns = () => {
  const { data: endorsementResponse } = useQuery(EndorsementListsUserOwns, {
    variables: {
      input: {
        tags: 'generalPetition',
        limit: 1000,
      },
    },
  })
  return endorsementResponse?.endorsementSystemUserEndorsementLists ?? []
}

export const useGetSinglePetition = (listId: string) => {
  const {
    data: petition,
    refetch: refetchSinglePetition,
    loading: loadingPetition,
  } = useQuery(GetSinglePetitionList, {
    variables: {
      input: {
        listId: listId,
      },
    },
  })

  const petitionData = petition?.endorsementSystemGetSingleEndorsementList ?? {}
  return { petitionData, refetchSinglePetition, loadingPetition }
}

export const useGetSingleEndorsement = (listId: string) => {
  const { data: endorsement } = useQuery(GetSingleEndorsement, {
    variables: {
      input: {
        listId: listId,
      },
    },
  })
  return endorsement?.endorsementSystemGetSingleEndorsement?.hasEndorsed
}

export const useGetPetitionEndorsementsPaginated = (
  listId: string,
  cursor?: string,
  pageDirection?: 'before' | 'after' | '',
) => {
  const {
    data: endorsementsPage,
    loading: loadingEndorsements,
    refetch,
  } = useQuery(GetEndorsements, {
    variables: {
      input: {
        before: pageDirection === 'before' ? cursor : '',
        after: pageDirection === 'after' ? cursor : '',
        listId: listId,
        limit: pageSize,
      },
    },
  })

  const endorsements = endorsementsPage?.endorsementSystemGetEndorsements ?? []
  return {
    endorsements,
    refetch,
    loadingEndorsements,
  }
}

export const useGetAllPetitionEndorsements = (
  listId: string,
  canRetrieve: boolean,
) => {
  const { data: endorsements, loading: loadingEndorsements } = useQuery(
    GetEndorsements,
    {
      variables: {
        input: {
          listId: listId,
          limit: 1000000,
        },
      },
      skip: !canRetrieve,
    },
  )

  const allEndorsements = endorsements?.endorsementSystemGetEndorsements ?? []
  return {
    allEndorsements,
    loadingEndorsements,
  }
}
