import type { WrappedLoaderFn } from '@island.is/portals/core'

import { GetClientsDocument, GetClientsQuery } from './Clients.generated'

export type AuthClients = GetClientsQuery['authAdminClients']['data']

export const clientsLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<AuthClients> => {
    if (!params['tenant']) {
      throw new Error('Tenant not found')
    }

    const clients = await client.query<GetClientsQuery>({
      query: GetClientsDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          tenantId: params['tenant'],
        },
      },
    })

    if (clients.error) {
      throw clients.error
    }

    return clients.data?.authAdminClients.data ?? []
  }
}
