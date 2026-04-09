import type { WrappedLoaderFn } from '@island.is/portals/core'
import { TenantsDocument, TenantsQuery } from './Tenants.generated'

export type AuthTenants = TenantsQuery['authAdminTenants']['data']

export const tenantsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<AuthTenants> => {
    const tenantsList = await client.query<TenantsQuery>({
      query: TenantsDocument,
      // Always hit the network so the list reflects any tenants that were
      // created / edited / deleted since the last visit. Also makes
      // `revalidator.revalidate()` from this screen actually refetch.
      fetchPolicy: 'network-only',
    })

    if (tenantsList.error) {
      throw tenantsList.error
    }

    return tenantsList.data?.authAdminTenants.data ?? []
  }
}
