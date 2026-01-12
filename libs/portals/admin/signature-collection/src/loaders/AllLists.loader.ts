import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  CollectionStatus,
  SignatureCollection,
  SignatureCollectionCollectionType,
  SignatureCollectionList,
} from '@island.is/api/schema'
import {
  CollectionDocument,
  CollectionQuery,
} from './allListsGraphql/getCollectionStatus.generated'
import {
  AllListsDocument,
  AllListsQuery,
} from './allListsGraphql/getAllSignatureLists.generated'

export interface ListsLoaderReturn {
  allLists: SignatureCollectionList[]
  collectionStatus: CollectionStatus
  collection: SignatureCollection
}

const createListsLoader =
  (collectionType: SignatureCollectionCollectionType): WrappedLoaderFn =>
  ({ client }) => {
    return async (): Promise<ListsLoaderReturn> => {
      const { data: collectionStatusData } =
        await client.query<CollectionQuery>({
          query: CollectionDocument,
          fetchPolicy: 'network-only',
          variables: {
            input: {
              collectionType,
            },
          },
        })
      const collection = collectionStatusData?.signatureCollectionAdminCurrent
      const { data } = await client.query<AllListsQuery>({
        query: AllListsDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            collectionId: collection?.id,
            collectionType,
          },
        },
      })

      const allLists = data?.signatureCollectionAdminLists ?? []
      const collectionStatus =
        collectionStatusData?.signatureCollectionAdminCurrent?.status

      return { allLists, collectionStatus, collection }
    }
  }

// Parliamentary Lists Loader
export const parliamentaryListsLoader: WrappedLoaderFn = createListsLoader(
  SignatureCollectionCollectionType.Parliamentary,
)

// Presidential Lists Loader
export const presidentialListsLoader: WrappedLoaderFn = createListsLoader(
  SignatureCollectionCollectionType.Presidential,
)

// Municipal Lists Loader
export const municipalListsLoader: WrappedLoaderFn = createListsLoader(
  SignatureCollectionCollectionType.LocalGovernmental,
)
