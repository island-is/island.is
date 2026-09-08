import { redirect } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Features } from '@island.is/feature-flags'
import type { WrappedLoaderFn } from '@island.is/portals/core'
import { replaceParams } from '@island.is/react-spa/shared'

import { IDSAdminPaths } from '../../../lib/paths'
import {
  TenantConfiguredEnvironmentsDocument,
  TenantConfiguredEnvironmentsQuery,
  TenantDetailsDocument,
  TenantDetailsQuery,
  TenantDetailsQueryVariables,
} from '../Tenants.generated'

export type EditTenantLoaderResult = NonNullable<
  TenantDetailsQuery['authAdminTenantDetails']
>

export type EditTenantEnvironment =
  EditTenantLoaderResult['environments'][number]

export interface EditTenantLoaderData {
  tenant: EditTenantLoaderResult
  configuredEnvironments: AuthAdminEnvironment[]
}

export const editTenantLoader: WrappedLoaderFn = ({
  client,
  userInfo,
  featureFlagClient,
}) => {
  return async ({ params }): Promise<EditTenantLoaderData | Response> => {
    const tenantId = params['tenant']

    if (!tenantId) {
      throw new Error('Tenant id not found')
    }

    const isSuperAdmin = userInfo.scopes.includes(
      AdminPortalScope.idsAdminSuperUser,
    )
    const showAdminControls =
      isSuperAdmin &&
      (await featureFlagClient.getValue(Features.showIdsAdminControls, false, {
        id: userInfo.profile.nationalId,
        attributes: {},
      }))

    if (!showAdminControls) {
      return redirect(
        replaceParams({
          href: IDSAdminPaths.IDSAdminClients,
          params: { tenant: tenantId },
        }),
      )
    }

    const [tenantResult, envsResult] = await Promise.all([
      client.query<TenantDetailsQuery, TenantDetailsQueryVariables>({
        query: TenantDetailsDocument,
        variables: { id: tenantId },
        fetchPolicy: 'network-only',
      }),
      client.query<TenantConfiguredEnvironmentsQuery>({
        query: TenantConfiguredEnvironmentsDocument,
        fetchPolicy: 'network-only',
      }),
    ])

    if (tenantResult.error || !tenantResult.data?.authAdminTenantDetails) {
      throw tenantResult.error ?? new Error(`Tenant ${tenantId} not found`)
    }

    if (envsResult.error) {
      console.error('Failed to fetch configured environments', envsResult.error)
    }

    return {
      tenant: tenantResult.data.authAdminTenantDetails,
      configuredEnvironments:
        envsResult.data?.authAdminTenantConfiguredEnvironments ?? [],
    }
  }
}
