import type { WrappedLoaderFn } from '@island.is/portals/core'
import { GetTenantDocument, GetTenantQuery } from './Tenant.generated'

export const tenantLoaderId = 'tenant'

export type TenantLoaderResult = GetTenantQuery['authAdminTenant']

export const tenantLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<TenantLoaderResult> => {
    const tenant = await client.query<GetTenantQuery>({
      query: GetTenantDocument,
      variables: {
        id: params['tenant'],
      },
    })

    if (tenant.error || !tenant.data) {
      throw tenant.error
    }

    return tenant.data.authAdminTenant
  }
}
