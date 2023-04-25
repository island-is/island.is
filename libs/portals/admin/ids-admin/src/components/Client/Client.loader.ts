import type { WrappedLoaderFn } from '@island.is/portals/core'
import { GetClientQuery, GetClientDocument } from './Client.generated'

export type AuthClient = GetClientQuery['authAdminClient']
export type AuthApplicationTranslation = GetClientQuery['authAdminClient']['environments'][0]['displayName'][0]

export const clientLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<AuthClient> => {
    if (!params['tenant']) {
      throw new Error('Tenant not found')
    }

    const authClient = await client.query<GetClientQuery>({
      query: GetClientDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          tenantId: params['tenant'],
          clientId: params['client'],
        },
      },
    })

    if (authClient.error) {
      throw authClient.error
    }

    if (!authClient.data?.authAdminClient) {
      throw new Error('Client not found')
    }

    return authClient.data?.authAdminClient ?? ({} as AuthClient)
  }
}
