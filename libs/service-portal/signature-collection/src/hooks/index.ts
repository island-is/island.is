import { useQuery } from '@apollo/client'
import {
  GetIsOwner,
  GetListById,
  GetListSignatures,
  GetListsForUser,
  GetSignedList,
} from './graphql/queries'
import {
  SignatureCollectionList,
  SignatureCollectionSignature,
  SignatureCollectionSuccess,
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
  } = useQuery<{ signatureCollectionSignedList?: SignatureCollectionList }>(
    GetSignedList,
  )
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
  } = useQuery<{ signatureCollectionListsForUser?: SignatureCollectionList[] }>(
    GetListsForUser,
  )

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
  } = useQuery<{ signatureCollectionIsOwner?: SignatureCollectionSuccess }>(
    GetIsOwner,
  )

  const isOwner =
    (getIsOwner?.signatureCollectionIsOwner as SignatureCollectionSuccess) ??
    false
  return { isOwner, loadingIsOwner, refetchIsOwner }
}
