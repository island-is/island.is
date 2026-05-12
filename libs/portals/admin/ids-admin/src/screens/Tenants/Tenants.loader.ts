import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  TenantConfiguredEnvironmentsDocument,
  TenantConfiguredEnvironmentsQuery,
  TenantsDocument,
  TenantsQuery,
} from './Tenants.generated'

export type AuthTenants = TenantsQuery['authAdminTenants']['data']

export interface TenantsLoaderData {
  tenants: AuthTenants
  configuredEnvironments: TenantConfiguredEnvironmentsQuery['authAdminTenantConfiguredEnvironments']
}

export const tenantsLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<TenantsLoaderData> => {
    const [tenantsResult, envsResult] = await Promise.all([
      client.query<TenantsQuery>({
        query: TenantsDocument,
        fetchPolicy: 'network-only',
      }),
      client.query<TenantConfiguredEnvironmentsQuery>({
        query: TenantConfiguredEnvironmentsDocument,
        fetchPolicy: 'network-only',
      }),
    ])

    if (tenantsResult.error) {
      throw tenantsResult.error
    }

    if (envsResult.error) {
      console.error('Failed to fetch configured environments', envsResult.error)
    }

    return {
      tenants: tenantsResult.data?.authAdminTenants.data ?? [],
      configuredEnvironments:
        envsResult.data?.authAdminTenantConfiguredEnvironments ?? [],
    }
  }
}
