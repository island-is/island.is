import { useQuery } from '@apollo/client'
import {
  GetIsOwner,
  GetListById,
  GetListSignatures,
  GetListsBySigneeArea,
  GetOwnerLists,
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

interface OwnerLists {
  signatureCollectionListsByOwner?: SignatureCollectionList[]
}

interface ListsByArea {
  signatureCollectionListsByArea?: SignatureCollectionList[]
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
    {}
  return { signedList, loadingSignedList, refetchSignedList }
}

export const useGetOwnerLists = () => {
  const { data: getOwnerLists, loading: loadingLists } =
    useQuery<OwnerLists>(GetOwnerLists)

  const ownerLists =
    (getOwnerLists?.signatureCollectionListsByOwner as SignatureCollectionList[]) ??
    []
  return { ownerLists, loadingLists }
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
