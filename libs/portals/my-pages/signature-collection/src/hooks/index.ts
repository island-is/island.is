import { useQuery } from '@apollo/client'
import {
  GetIsOwner,
  GetListById,
  GetListSignatures,
  GetListsForUser,
  GetSignedList,
  GetListsForOwner,
  GetCurrentCollection,
  GetCanSign,
  GetCollectors,
  getPdfReport,
} from './graphql/queries'
import {
  SignatureCollectionSignature,
  SignatureCollectionList,
  SignatureCollectionSuccess,
  SignatureCollection,
  SignatureCollectionSignedList,
  SignatureCollectionCollector,
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
          listId,
        },
      },
    },
  )
  const listInfo =
    (signatureList?.signatureCollectionList as SignatureCollectionList) ?? null
  return { listInfo, refetchSignatureList, loadingList }
}

export const useGetListSignees = (listId: string) => {
  const {
    data: listSignatures,
    refetch: refetchListSignees,
    loading: loadingSignees,
  } = useQuery<{
    signatureCollectionSignatures?: SignatureCollectionSignature[]
  }>(GetListSignatures, {
    variables: {
      input: {
        listId,
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
    loading: loadingSignedLists,
    refetch: refetchSignedLists,
  } = useQuery<{
    signatureCollectionSignedList?: SignatureCollectionSignedList[]
  }>(GetSignedList)
  const signedLists =
    (getSignedList?.signatureCollectionSignedList as SignatureCollectionSignedList[]) ??
    null
  return { signedLists, loadingSignedLists, refetchSignedLists }
}

export const useGetListsForUser = (collectionId?: string) => {
  const {
    data: getListsForUser,
    loading: loadingUserLists,
    refetch: refetchListsForUser,
    error: getListsForUserError,
  } = useQuery<{
    signatureCollectionListsForUser?: SignatureCollectionList[]
  }>(GetListsForUser, {
    variables: {
      input: {
        collectionId,
      },
    },
    skip: !collectionId,
  })

  const listsForUser =
    (getListsForUser?.signatureCollectionListsForUser as SignatureCollectionList[]) ??
    []
  return {
    listsForUser,
    loadingUserLists,
    refetchListsForUser,
    getListsForUserError,
  }
}

export const useGetListsForOwner = (collectionId: string) => {
  const {
    data: getListsForOwner,
    loading: loadingOwnerLists,
    refetch: refetchListsForOwner,
  } = useQuery<{
    signatureCollectionListsForOwner?: SignatureCollectionList[]
  }>(GetListsForOwner, {
    variables: {
      input: {
        collectionId,
      },
      skip: !collectionId,
    },
  })

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
    null
  return {
    currentCollection,
    loadingCurrentCollection,
    refetchCurrentCollection,
  }
}

export const useGetCanSign = (
  signeeId: string,
  listId: string,
  isValidId: boolean,
) => {
  const { data: getCanSignData, loading: loadingCanSign } = useQuery(
    GetCanSign,
    {
      variables: {
        input: {
          signeeNationalId: signeeId,
          listId: listId,
        },
      },
      skip: !signeeId || signeeId.length !== 10 || !isValidId,
    },
  )
  const canSign = getCanSignData?.signatureCollectionCanSignFromPaper ?? false
  return { canSign, loadingCanSign }
}

export const useGetCollectors = () => {
  const { data: getCollectorsData, loading: loadingCollectors } = useQuery(
    GetCollectors,
  )
  const collectors =
    (getCollectorsData?.signatureCollectionCollectors as SignatureCollectionCollector[]) ??
    []
  return { collectors, loadingCollectors }
}

export const useGetPdfReport = (listId: string) => {
  const { data: pdfReportData, loading: loadingReport } = useQuery(
    getPdfReport,
    {
      variables: {
        input: {
          listId,
        },
      },
      skip: !listId,
    },
  )
  const report = pdfReportData?.signatureCollectionListOverview ?? {}
  return { report, loadingReport }
}
