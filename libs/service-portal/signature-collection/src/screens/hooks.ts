import { useQuery } from '@apollo/client'
import {
  GetIsOwner,
  GetListById,
  GetListSignatures,
  GetListsBySigneeArea,
  GetOwnerLists,
  GetSignedList,
} from './queries'
import { SignatureList, Signature, Success } from '@island.is/api/schema'

interface SignatureListInfo {
  signatureCollectionList?: SignatureList
}

interface ListSignees {
  signatureCollectionSignatures?: Signature[]
}

interface OwnerLists {
  signatureCollectionListsByOwner?: SignatureList[]
}

interface ListsByArea {
  signatureCollectionListsByArea?: SignatureList[]
}

interface IsOwner {
  signatureCollectionIsOwner?: Success
}

interface SignedList {
  signatureCollectionSignedList?: SignatureList
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
    (signatureList?.signatureCollectionList as SignatureList) ?? {}
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
    (listSignatures?.signatureCollectionSignatures as Signature[]) ?? []
  return { listSignees, refetchListSignees, loadingSignees }
}

export const useGetSignedList = () => {
  const {
    data: getSignedList,
    loading: loadingSignedList,
    refetch: refetchSignedList,
  } = useQuery<SignedList>(GetSignedList)

  const signedList =
    (getSignedList?.signatureCollectionSignedList as SignatureList) ?? {}
  return { signedList, loadingSignedList, refetchSignedList }
}

export const useGetOwnerLists = () => {
  const { data: getOwnerLists, loading: loadingLists } =
    useQuery<OwnerLists>(GetOwnerLists)

  const ownerLists =
    (getOwnerLists?.signatureCollectionListsByOwner as SignatureList[]) ?? []
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
    (getListsBySigneeArea?.signatureCollectionListsByArea as SignatureList[]) ??
    []
  return { listsBySigneeArea, loadingAreaLists, refetchListsBySigneeArea }
}

export const useIsOwner = () => {
  const { data: getIsOwner, loading: loadingIsOwner } =
    useQuery<IsOwner>(GetIsOwner)

  const isOwner = (getIsOwner?.signatureCollectionIsOwner as Success) ?? false
  return { isOwner, loadingIsOwner }
}
