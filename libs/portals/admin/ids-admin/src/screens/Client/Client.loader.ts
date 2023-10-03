import type { WrappedLoaderFn } from '@island.is/portals/core'
import { GetClientQuery, GetClientDocument } from './Client.generated'
import { NotFoundError } from '@island.is/react-spa/shared'
import { m } from '../../lib/messages'

export type AuthAdminClient = NonNullable<GetClientQuery['authAdminClient']>
export type AuthAdminClientEnvironment = AuthAdminClient['environments'][0]
export type AuthAdminClientTranslation =
  AuthAdminClientEnvironment['displayName'][0]
export type AuthAdminClientSecret = AuthAdminClientEnvironment['secrets']

export const clientLoader: WrappedLoaderFn = ({ client, formatMessage }) => {
  return async ({ params }): Promise<AuthAdminClient> => {
    const tenantId = params['tenant']

    if (!tenantId) {
      throw new Error('Tenant not found')
    }

    const authClient = await client.query<GetClientQuery>({
      query: GetClientDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          tenantId,
          clientId: params['client'],
        },
      },
    })

    if (authClient.error) {
      throw authClient.error
    }

    if (!authClient.data?.authAdminClient) {
      throw new NotFoundError(
        formatMessage(m.typeNotFound, {
          type: formatMessage(m.client),
        }),
        formatMessage(m.typeNotFoundMessage),
      )
    }

    return authClient.data.authAdminClient
  }
}
