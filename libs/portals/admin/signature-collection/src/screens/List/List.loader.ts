import type { WrappedLoaderFn } from '@island.is/portals/core'
import { ListbyidDocument, ListbyidQuery } from './getSignatureList.generated'
import { SignaturesDocument, SignaturesQuery } from './getListSignees.generated'
import {
  SignatureCollectionList,
  SignatureCollectionSignature,
} from '@island.is/api/schema'

export const listLoader: WrappedLoaderFn = ({ client }) => {
  return async ({
    params,
  }): Promise<{
    list: SignatureCollectionList
    allSignees: SignatureCollectionSignature[]
  }> => {
    const { data } = await client.query<ListbyidQuery>({
      query: ListbyidDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          id: params.id,
        },
      },
    })

    const { data: signeesData } = await client.query<SignaturesQuery>({
      query: SignaturesDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          id: params.id,
        },
      },
    })

    const list = data?.signatureCollectionAdminList ?? {}
    const allSignees = signeesData?.signatureCollectionAdminSignatures ?? []

    return { list, allSignees }
  }
}
