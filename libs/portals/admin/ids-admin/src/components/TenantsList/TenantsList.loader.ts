import type { WrappedLoaderFn } from '@island.is/portals/core'
import { TenantsListDocument, TenantsListQuery } from './TenantsList.generated'

export type AuthTenantsList = TenantsListQuery['authAdminTenants']['data']

export const tenantsListLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<AuthTenantsList> => {
    const tenantsList = await client.query<TenantsListQuery>({
      query: TenantsListDocument,
    })

    if (tenantsList.error) {
      throw tenantsList.error
    }

    return tenantsList.data?.authAdminTenants.data ?? []
  }
}
