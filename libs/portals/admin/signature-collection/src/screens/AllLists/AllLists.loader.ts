import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  AllListsDocument,
  AllListsQuery,
} from './graphql/getAllSignatureLists.generated'
import { SignatureCollectionList } from '@island.is/api/schema'
import {
  CollectionDocument,
  CollectionQuery,
} from './graphql/getCollectionStatus.generated'

export interface ListsLoaderReturn {
  allLists: SignatureCollectionList[]
  collectionStatus: string
  collectionId: string
}

export const listsLoader: WrappedLoaderFn = ({ client }) => {
  return async ({
    params,
  }): Promise<{
    allLists: SignatureCollectionList[]
    collectionStatus: string
    collectionId: string
  }> => {
    const { data: collectionStatusData } = await client.query<CollectionQuery>({
      query: CollectionDocument,
      fetchPolicy: 'network-only',
    })
    const collectionId =
      collectionStatusData?.signatureCollectionAdminCurrent?.id
    const { data } = await client.query<AllListsQuery>({
      query: AllListsDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          collectionId,
        },
      },
    })

    const allLists = data?.signatureCollectionAdminLists ?? []
    const collectionStatus =
      collectionStatusData?.signatureCollectionAdminCurrent?.status

    return { allLists, collectionStatus, collectionId }
  }
}
