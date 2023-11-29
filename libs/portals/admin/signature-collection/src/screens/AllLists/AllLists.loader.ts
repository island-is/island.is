import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  AllListsDocument,
  AllListsQuery,
} from './getAllSignatureLists.generated'

export const listsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<any> => {
    const { data } = await client.query<AllListsQuery>({
      query: AllListsDocument,
      fetchPolicy: 'network-only',
    })

    const lists = data?.signatureCollectionAllLists ?? []
    return lists
  }
}
