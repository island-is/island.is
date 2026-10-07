import { redirect } from 'react-router-dom'

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

type ConfiguredEnvironments =
  TenantConfiguredEnvironmentsQuery['authAdminTenantConfiguredEnvironments']

export type EditTenantLoaderResult = NonNullable<
  TenantDetailsQuery['authAdminTenantDetails']
> & {
  configuredEnvironments: ConfiguredEnvironments
}

export type EditTenantEnvironment =
  EditTenantLoaderResult['environments'][number]

export const editTenantLoader: WrappedLoaderFn = ({
  client,
  userInfo,
  featureFlagClient,
}) => {
  return async ({ params }) => {
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

    const [response, configuredEnvironments] = await Promise.all([
      client.query<TenantDetailsQuery, TenantDetailsQueryVariables>({
        query: TenantDetailsDocument,
        variables: { id: tenantId },
        fetchPolicy: 'network-only',
      }),
      client
        .query<TenantConfiguredEnvironmentsQuery>({
          query: TenantConfiguredEnvironmentsDocument,
          fetchPolicy: 'network-only',
        })
        .then((result) => result.data?.authAdminTenantConfiguredEnvironments)
        .catch((error) => {
          console.error('Failed to fetch configured environments', error)
          return undefined
        }),
    ])

    if (response.error || !response.data?.authAdminTenantDetails) {
      throw response.error ?? new Error(`Tenant ${tenantId} not found`)
    }

    const tenant = response.data.authAdminTenantDetails

    return {
      ...tenant,
      configuredEnvironments:
        configuredEnvironments && configuredEnvironments.length > 0
          ? configuredEnvironments
          : tenant.availableEnvironments,
    }
  }
}
