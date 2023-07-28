import type { WrappedLoaderFn } from '@island.is/portals/core'
import {
  AuthAdminScopesDocument,
  AuthAdminScopesQuery,
  AuthAdminScopesQueryVariables,
} from './Permissions.generated'

export type PermissionsLoaderData = AuthAdminScopesQuery['authAdminScopes']

export const permissionsLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<PermissionsLoaderData> => {
    const tenantId = params['tenant']

    if (!tenantId) {
      throw new Error('Tenant not found')
    }

    const scopesQueryResult = await client.query<
      AuthAdminScopesQuery,
      AuthAdminScopesQueryVariables
    >({
      query: AuthAdminScopesDocument,
      fetchPolicy: 'network-only',
      variables: {
        input: {
          tenantId,
        },
      },
    })

    if (scopesQueryResult.error) {
      throw scopesQueryResult.error
    }

    if (!scopesQueryResult.data?.authAdminScopes) {
      throw new Error('No scopes found')
    }

    return scopesQueryResult.data.authAdminScopes
  }
}
