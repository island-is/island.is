import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  AllListsDocument,
  AllListsQuery,
} from './getAllSignatureLists.generated'
import { SignatureCollectionList } from '@island.is/api/schema'

export const listsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<SignatureCollectionList[]> => {
    const { data } = await client.query<AllListsQuery>({
      query: AllListsDocument,
      fetchPolicy: 'network-only',
    })

    const allLists = data?.signatureCollectionAllLists ?? []
    return allLists
  }
}
