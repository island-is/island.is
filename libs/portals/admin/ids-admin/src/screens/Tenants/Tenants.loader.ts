import type { WrappedLoaderFn } from '@island.is/portals/core'
import { TenantsDocument, TenantsQuery } from './Tenants.generated'

export type AuthTenants = TenantsQuery['authAdminTenants']['data']

export const tenantsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<AuthTenants> => {
    const tenantsList = await client.query<TenantsQuery>({
      query: TenantsDocument,
    })

    if (tenantsList.error) {
      throw tenantsList.error
    }

    return tenantsList.data?.authAdminTenants.data ?? []
  }
}
