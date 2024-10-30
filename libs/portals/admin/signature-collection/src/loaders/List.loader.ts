import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  SignatureCollectionList,
  SignatureCollectionSignature,
} from '@island.is/api/schema'
import {
  ListbyidDocument,
  ListbyidQuery,
} from './listGraphql/getSignatureList.generated'
import {
  SignaturesDocument,
  SignaturesQuery,
} from './listGraphql/getListSignees.generated'
import {
  ListStatusDocument,
  ListStatusQuery,
} from './listGraphql/getListStatus.generated'

export const listLoader: WrappedLoaderFn = ({ client }) => {
  return async ({
    params,
  }): Promise<{
    list: SignatureCollectionList
    allSignees: SignatureCollectionSignature[]
    listStatus: string
  }> => {
    const { data } = await client.query<ListbyidQuery>({
      query: ListbyidDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          listId: params.listId,
        },
      },
    })

    const { data: signeesData } = await client.query<SignaturesQuery>({
      query: SignaturesDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          listId: params.listId,
        },
      },
    })

    const { data: listStatusData } = await client.query<ListStatusQuery>({
      query: ListStatusDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          listId: params.listId,
        },
      },
    })

    const list = data?.signatureCollectionAdminList ?? {}
    const allSignees = signeesData?.signatureCollectionAdminSignatures ?? []
    const listStatus =
      listStatusData?.signatureCollectionAdminListStatus?.status ?? ''

    return { list, allSignees, listStatus }
  }
}
