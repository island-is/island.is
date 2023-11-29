import type { WrappedLoaderFn } from '@island.is/portals/core'
import { ListbyidDocument, ListbyidQuery } from './getSignatureList.generated'

export const listLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<any> => {
    const { data } = await client.query<ListbyidQuery>({
      query: ListbyidDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          id: params.id,
        },
      },
    })

    const list = data?.signatureCollectionList ?? {}
    return list
  }
}
