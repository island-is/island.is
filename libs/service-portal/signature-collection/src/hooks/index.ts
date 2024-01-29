import { useQuery } from '@apollo/client'
import {
  GetIsOwner,
  GetListById,
  GetListSignatures,
  GetListsForUser,
  GetSignedList,
  GetListsForOwner,
  GetCurrentCollection,
} from './graphql/queries'
import {
  SignatureCollectionListBase,
  SignatureCollectionSignature,
  SignatureCollectionList,
  SignatureCollectionSuccess,
  SignatureCollection,
} from '@island.is/api/schema'

export const useGetSignatureList = (listId: string) => {
  const {
    data: signatureList,
    refetch: refetchSignatureList,
    loading: loadingList,
  } = useQuery<{ signatureCollectionList?: SignatureCollectionList }>(
    GetListById,
    {
      variables: {
        input: {
          id: listId,
        },
      },
    },
  )
  const listInfo =
    (signatureList?.signatureCollectionList as SignatureCollectionList) ?? {}
  return { listInfo, refetchSignatureList, loadingList }
}

export const useGetListSignees = (listId: string, pageNumber?: number) => {
  const {
    data: listSignatures,
    refetch: refetchListSignees,
    loading: loadingSignees,
  } = useQuery<{
    signatureCollectionSignatures?: SignatureCollectionSignature[]
  }>(GetListSignatures, {
    variables: {
      input: {
        id: listId,
      },
    },
  })
  const listSignees =
    (listSignatures?.signatureCollectionSignatures as SignatureCollectionSignature[]) ??
    []
  return { listSignees, refetchListSignees, loadingSignees }
}

export const useGetSignedList = () => {
  const {
    data: getSignedList,
    loading: loadingSignedList,
    refetch: refetchSignedList,
  } = useQuery<{ signatureCollectionSignedList?: SignatureCollectionListBase }>(
    GetSignedList,
  )
  const signedList =
    (getSignedList?.signatureCollectionSignedList as SignatureCollectionListBase) ??
    null
  return { signedList, loadingSignedList, refetchSignedList }
}

export const useGetListsForUser = () => {
  const {
    data: getListsForUser,
    loading: loadingUserLists,
    refetch: refetchListsForUser,
  } = useQuery<{
    signatureCollectionListsForUser?: SignatureCollectionListBase[]
  }>(GetListsForUser)

  const listsForUser =
    (getListsForUser?.signatureCollectionListsForUser as SignatureCollectionListBase[]) ??
    []
  return { listsForUser, loadingUserLists, refetchListsForUser }
}

export const useGetListsForOwner = () => {
  const {
    data: getListsForOwner,
    loading: loadingOwnerLists,
    refetch: refetchListsForOwner,
  } = useQuery<{
    signatureCollectionListsForOwner?: SignatureCollectionList[]
  }>(GetListsForOwner)

  const listsForOwner =
    (getListsForOwner?.signatureCollectionListsForOwner as SignatureCollectionList[]) ??
    []
  return { listsForOwner, loadingOwnerLists, refetchListsForOwner }
}

export const useIsOwner = () => {
  const {
    data: getIsOwner,
    loading: loadingIsOwner,
    refetch: refetchIsOwner,
  } = useQuery<{ signatureCollectionIsOwner?: SignatureCollectionSuccess }>(
    GetIsOwner,
  )

  const isOwner =
    (getIsOwner?.signatureCollectionIsOwner as SignatureCollectionSuccess) ??
    false
  return { isOwner, loadingIsOwner, refetchIsOwner }
}

export const useGetCurrentCollection = () => {
  const {
    data: getCurrentCollection,
    loading: loadingCurrentCollection,
    refetch: refetchCurrentCollection,
  } = useQuery<{
    signatureCollectionCurrent?: SignatureCollection
  }>(GetCurrentCollection)

  const currentCollection =
    (getCurrentCollection?.signatureCollectionCurrent as SignatureCollection) ??
    false
  return {
    currentCollection,
    loadingCurrentCollection,
    refetchCurrentCollection,
  }
}
