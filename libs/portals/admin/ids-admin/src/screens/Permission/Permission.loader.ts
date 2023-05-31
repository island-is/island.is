import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  AuthAdminScopeDocument,
  AuthAdminScopeQuery,
  AuthAdminScopeQueryVariables,
} from './Permission.generated'

export type PermissionLoaderResult = AuthAdminScopeQuery['authAdminScope']

export const permissionLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<PermissionLoaderResult> => {
    const tenantId = params['tenant']
    const scopeName = params['permission']

    if (!tenantId) throw new Error('Tenant id not found')
    if (!scopeName) throw new Error('Permission id not found')

    const scopeQueryResult = await client.query<
      AuthAdminScopeQuery,
      AuthAdminScopeQueryVariables
    >({
      query: AuthAdminScopeDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          tenantId,
          scopeName,
        },
      },
    })

    if (scopeQueryResult.error) {
      throw scopeQueryResult.error
    }

    if (!scopeQueryResult.data?.authAdminScope) {
      throw new Error('Scope not found')
    }

    return scopeQueryResult.data.authAdminScope
  }
}
