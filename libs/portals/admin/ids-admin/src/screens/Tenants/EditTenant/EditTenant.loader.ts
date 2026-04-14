import { redirect } from 'react-router-dom'

import { AdminPortalScope } from '@island.is/auth/scopes'
import type { WrappedLoaderFn } from '@island.is/portals/core'
import { replaceParams } from '@island.is/react-spa/shared'

import { IDSAdminPaths } from '../../../lib/paths'
import {
  TenantDetailsDocument,
  TenantDetailsQuery,
  TenantDetailsQueryVariables,
} from '../Tenants.generated'

export type EditTenantLoaderResult = NonNullable<
  TenantDetailsQuery['authAdminTenantDetails']
>

export type EditTenantEnvironment =
  EditTenantLoaderResult['environments'][number]

export const editTenantLoader: WrappedLoaderFn = ({ client, userInfo }) => {
  return async ({ params }) => {
    const tenantId = params['tenant']

    if (!tenantId) {
      throw new Error('Tenant id not found')
    }

    if (!userInfo.scopes.includes(AdminPortalScope.idsAdminSuperUser)) {
      return redirect(
        replaceParams({
          href: IDSAdminPaths.IDSAdminClients,
          params: { tenant: tenantId },
        }),
      )
    }

    const response = await client.query<
      TenantDetailsQuery,
      TenantDetailsQueryVariables
    >({
      query: TenantDetailsDocument,
      variables: { id: tenantId },
      fetchPolicy: 'network-only',
    })

    if (response.error || !response.data?.authAdminTenantDetails) {
      throw response.error ?? new Error(`Tenant ${tenantId} not found`)
    }

    return response.data.authAdminTenantDetails
  }
}
