import { useMutation, useQuery } from '@apollo/client'
import {
  GetIsOwner,
  GetListById,
  GetListSignatures,
  GetListsForUser,
  GetSignedList,
} from './queries'
import { cancelCollectionMutation } from './mutations'
import {
  SignatureCollectionList,
  SignatureCollectionSignature,
  SignatureCollectionSuccess,
} from '@island.is/api/schema'

interface SignatureListInfo {
  signatureCollectionList?: SignatureCollectionList
}

interface ListSignees {
  signatureCollectionSignatures?: SignatureCollectionSignature[]
}

interface ListsForUser {
  signatureCollectionListsForUser?: SignatureCollectionList[]
}

interface IsOwner {
  signatureCollectionIsOwner?: SignatureCollectionSuccess
}

interface SignedList {
  signatureCollectionSignedList?: SignatureCollectionList
}

export const useGetSignatureList = (listId: string) => {
  const {
    data: signatureList,
    refetch: refetchSignatureList,
    loading: loadingList,
  } = useQuery<SignatureListInfo>(GetListById, {
    variables: {
      input: {
        id: listId,
      },
    },
  })
  const listInfo =
    (signatureList?.signatureCollectionList as SignatureCollectionList) ?? {}
  return { listInfo, refetchSignatureList, loadingList }
}

export const useGetListSignees = (listId: string, pageNumber?: number) => {
  const {
    data: listSignatures,
    refetch: refetchListSignees,
    loading: loadingSignees,
  } = useQuery<ListSignees>(GetListSignatures, {
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
  } = useQuery<SignedList>(GetSignedList)
  const signedList =
    (getSignedList?.signatureCollectionSignedList as SignatureCollectionList) ??
    null
  return { signedList, loadingSignedList, refetchSignedList }
}

export const useGetListsForUser = () => {
  const {
    data: getListsForUser,
    loading: loadingUserLists,
    refetch: refetchListsForUser,
  } = useQuery<ListsForUser>(GetListsForUser)

  const listsForUser =
    (getListsForUser?.signatureCollectionListsForUser as SignatureCollectionList[]) ??
    []
  return { listsForUser, loadingUserLists, refetchListsForUser }
}

export const useIsOwner = () => {
  const {
    data: getIsOwner,
    loading: loadingIsOwner,
    refetch: refetchIsOwner,
  } = useQuery<IsOwner>(GetIsOwner)

  const isOwner =
    (getIsOwner?.signatureCollectionIsOwner as SignatureCollectionSuccess) ??
    false
  return { isOwner, loadingIsOwner, refetchIsOwner }
}
