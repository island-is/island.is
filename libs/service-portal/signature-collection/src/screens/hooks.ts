import { useQuery } from '@apollo/client'
import {
  GetIsOwner,
  GetListById,
  GetListSignatures,
  GetListsBySigneeArea,
  GetListsForUser,
  GetSignedList,
} from './queries'
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

interface ListsByArea {
  signatureCollectionListsByArea?: SignatureCollectionList[]
}
interface ListsForUser{
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
  console.log('signatureList', signatureList)
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

export const useGetOwnerLists = () => {
  const { data: getListsForUser, loading: loadingLists } =
    useQuery<ListsForUser>(GetListsForUser)

  const ownerLists =
    (getListsForUser?.signatureCollectionListsForUser as SignatureCollectionList[]) ??
    []
  return { ownerLists, loadingLists }
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

export const useGetListsBySigneeArea = (area: string) => {
  const {
    data: getListsBySigneeArea,
    loading: loadingAreaLists,
    refetch: refetchListsBySigneeArea,
  } = useQuery<ListsByArea>(GetListsBySigneeArea, {
    variables: {
      input: {
        areaId: area,
      },
    },
  })

  const listsBySigneeArea =
    (getListsBySigneeArea?.signatureCollectionListsByArea as SignatureCollectionList[]) ??
    []
  return { listsBySigneeArea, loadingAreaLists, refetchListsBySigneeArea }
}



export const useIsOwner = () => {
  const { data: getIsOwner, loading: loadingIsOwner } =
    useQuery<IsOwner>(GetIsOwner)

  const isOwner =
    (getIsOwner?.signatureCollectionIsOwner as SignatureCollectionSuccess) ??
    false
  return { isOwner, loadingIsOwner }
}
