import { WrappedLoaderFn } from '@island.is/portals/core'
import { GetScopesDocument, GetScopesQuery } from './AddPermissions.generated'

export type AuthScopes = GetScopesQuery['authAdminTenantsScopes']
export type Scopes = AuthScopes[0]['scopes'][0]

export const addPermissionsLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<AuthScopes> => {
    if (!params['tenant']) {
      throw new Error('Tenant not found')
    }

    const scopes = await client.query<GetScopesQuery>({
      query: GetScopesDocument,
      fetchPolicy: 'network-only',
      variables: {
        tenantId: params['tenant'],
      },
    })

    return scopes.data?.authAdminTenantsScopes ?? []
  }
}
