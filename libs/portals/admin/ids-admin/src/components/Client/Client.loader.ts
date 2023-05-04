import type { WrappedLoaderFn } from '@island.is/portals/core'
import { GetClientQuery, GetClientDocument } from './Client.generated'

export type AuthAdminClient = GetClientQuery['authAdminClient']
export type AuthAdminClientTranslation = GetClientQuery['authAdminClient']['environments'][0]['displayName'][0]
export type AuthAdminClientSecret = GetClientQuery['authAdminClient']['environments'][0]['secrets']

export const clientLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<AuthAdminClient> => {
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

    return authClient.data?.authAdminClient ?? ({} as AuthAdminClient)
  }
}
