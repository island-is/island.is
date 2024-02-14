import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  ListbyidDocument,
  ListbyidQuery,
} from './graphql/getSignatureList.generated'
import {
  SignatureCollectionList,
  SignatureCollectionSignature,
} from '@island.is/api/schema'
import {
  ListStatusDocument,
  ListStatusQuery,
} from './graphql/getListStatus.generated'
import {
  SignaturesDocument,
  SignaturesQuery,
} from './graphql/getListSignees.generated'

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

    const { data: listStatusData } = await client.query<ListStatusQuery>({
      query: ListStatusDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          id: params.id,
        },
      },
    })

    const list = data?.signatureCollectionAdminList ?? {}
    const allSignees = signeesData?.signatureCollectionAdminSignatures ?? []
    const listStatus =
      listStatusData?.signatureCollectionAdminListStatus.status ?? ''

    return { list, allSignees, listStatus }
  }
}
