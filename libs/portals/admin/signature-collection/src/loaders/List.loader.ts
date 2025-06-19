import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  SignatureCollectionCollectionType,
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

const createListLoader =
  (collectionType: SignatureCollectionCollectionType): WrappedLoaderFn =>
  ({ client }) => {
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
            collectionType,
          },
        },
      })

      const { data: signeesData } = await client.query<SignaturesQuery>({
        query: SignaturesDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            listId: params.listId,
            collectionType,
          },
        },
      })

      const { data: listStatusData } = await client.query<ListStatusQuery>({
        query: ListStatusDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            listId: params.listId,
            collectionType,
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

// Parliamentary List Loader
export const parliamentaryListLoader: WrappedLoaderFn = createListLoader(
  SignatureCollectionCollectionType.Parliamentary,
)

// Presidential List Loader
export const presidentialListLoader: WrappedLoaderFn = createListLoader(
  SignatureCollectionCollectionType.Presidential,
)

// Municipal List Loader
export const municipalListLoader: WrappedLoaderFn = createListLoader(
  SignatureCollectionCollectionType.LocalGovernmental,
)
