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
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'

export const useGetSignatureList = (
  listId: string,
  collectionType: SignatureCollectionCollectionType,
) => {
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
          collectionType,
        },
      },
    },
  )
  const listInfo =
    (signatureList?.signatureCollectionList as SignatureCollectionList) ?? null
  return { listInfo, refetchSignatureList, loadingList }
}

export const useGetListSignees = (
  listId: string,
  collectionType: SignatureCollectionCollectionType,
) => {
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
        collectionType,
      },
    },
  })
  const listSignees =
    (listSignatures?.signatureCollectionSignatures as SignatureCollectionSignature[]) ??
    []
  return { listSignees, refetchListSignees, loadingSignees }
}

export const useGetSignedList = (
  collectionType: SignatureCollectionCollectionType,
) => {
  const {
    data: getSignedList,
    loading: loadingSignedLists,
    refetch: refetchSignedLists,
  } = useQuery<{
    signatureCollectionSignedList?: SignatureCollectionSignedList[]
  }>(GetSignedList, {
    variables: {
      input: {
        collectionType,
      },
    },
  })
  const signedLists =
    (getSignedList?.signatureCollectionSignedList as SignatureCollectionSignedList[]) ??
    null
  return { signedLists, loadingSignedLists, refetchSignedLists }
}

export const useGetListsForUser = (
  collectionType: SignatureCollectionCollectionType,
  collectionId?: string,
) => {
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
        collectionType,
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

export const useGetListsForOwner = (
  collectionType: SignatureCollectionCollectionType,
  collectionId: string,
) => {
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
        collectionType,
      },
      skip: !collectionId,
    },
  })

  const listsForOwner =
    (getListsForOwner?.signatureCollectionListsForOwner as SignatureCollectionList[]) ??
    []
  return { listsForOwner, loadingOwnerLists, refetchListsForOwner }
}

export const useIsOwner = (
  collectionType: SignatureCollectionCollectionType,
) => {
  const {
    data: getIsOwner,
    loading: loadingIsOwner,
    refetch: refetchIsOwner,
  } = useQuery<{ signatureCollectionIsOwner?: SignatureCollectionSuccess }>(
    GetIsOwner,
    {
      variables: {
        input: {
          collectionType,
        },
      },
    },
  )

  const isOwner =
    (getIsOwner?.signatureCollectionIsOwner as SignatureCollectionSuccess) ??
    false
  return { isOwner, loadingIsOwner, refetchIsOwner }
}

export const useGetCurrentCollection = (
  collectionType?: SignatureCollectionCollectionType,
) => {
  const {
    data: getCurrentCollection,
    loading: loadingCurrentCollection,
    refetch: refetchCurrentCollection,
  } = useQuery<{
    signatureCollectionLatestForType?: SignatureCollection
  }>(GetCurrentCollection, {
    variables: {
      input: {
        collectionType,
      },
    },
  })
  const currentCollection =
    (getCurrentCollection?.signatureCollectionLatestForType as SignatureCollection) ??
    null
  return {
    currentCollection,
    loadingCurrentCollection,
    refetchCurrentCollection,
  }
}

export const useGetCanSign = (
  collectionType: SignatureCollectionCollectionType,
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
          collectionType,
        },
      },
      skip: !signeeId || signeeId.length !== 10 || !isValidId,
    },
  )
  const canSign = getCanSignData?.signatureCollectionCanSignFromPaper ?? false
  return { canSign, loadingCanSign }
}

export const useGetCollectors = (
  collectionType: SignatureCollectionCollectionType,
) => {
  const { data: getCollectorsData, loading: loadingCollectors } = useQuery(
    GetCollectors,
    {
      variables: {
        input: {
          collectionType,
        },
      },
    },
  )
  const collectors =
    (getCollectorsData?.signatureCollectionCollectors as SignatureCollectionCollector[]) ??
    []
  return { collectors, loadingCollectors }
}

export const useGetPdfReport = (
  listId: string,
  collectionType: SignatureCollectionCollectionType,
) => {
  const { data: pdfReportData, loading: loadingReport } = useQuery(
    getPdfReport,
    {
      variables: {
        input: {
          listId,
          collectionType,
        },
      },
      skip: !listId,
    },
  )
  const report = pdfReportData?.signatureCollectionListOverview ?? {}
  return { report, loadingReport }
}
