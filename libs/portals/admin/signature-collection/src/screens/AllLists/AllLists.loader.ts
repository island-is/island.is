import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  AllListsDocument,
  AllListsQuery,
} from './graphql/getAllSignatureLists.generated'
import { SignatureCollectionList } from '@island.is/api/schema'
import {
  CollectionStatusDocument,
  CollectionStatusQuery,
} from './graphql/getCollectionStatus.generated'

export const listsLoader: WrappedLoaderFn = ({ client }) => {
  return async ({
    params,
  }): Promise<{
    allLists: SignatureCollectionList[]
    collectionStatus: string
  }> => {
    const { data } = await client.query<AllListsQuery>({
      query: AllListsDocument,
      fetchPolicy: 'network-only',
    })

    const { data: collectionStatusData } =
      await client.query<CollectionStatusQuery>({
        query: CollectionStatusDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            id: params.id,
          },
        },
      })

    const allLists = data?.signatureCollectionAdminLists ?? []
    const collectionStatus =
      collectionStatusData?.signatureCollectionAdminStatus.status ?? ''

    return { allLists, collectionStatus }
  }
}
