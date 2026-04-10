import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetApiScopeUsersDocument,
  GetApiScopeUsersQuery,
  GetAccessControlledScopesDocument,
  GetAccessControlledScopesQuery,
} from './ApiScopeUsers.generated'

export interface ApiScopeUsersLoaderData {
  users: GetApiScopeUsersQuery['authAdminApiScopeUsers']
  accessControlledScopes: GetAccessControlledScopesQuery['authAdminAccessControlledScopes']
}

export const apiScopeUsersLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ request }): Promise<ApiScopeUsersLoaderData> => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const search = url.searchParams.get('search') ?? ''

    const [usersResult, scopesResult] = await Promise.all([
      client.query<GetApiScopeUsersQuery>({
        query: GetApiScopeUsersDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            searchString: search,
            page,
            count: 20,
          },
        },
      }),
      client.query<GetAccessControlledScopesQuery>({
        query: GetAccessControlledScopesDocument,
        fetchPolicy: 'network-only',
      }),
    ])

    if (usersResult.error) {
      throw usersResult.error
    }

    return {
      users: usersResult.data?.authAdminApiScopeUsers ?? {
        rows: [],
        totalCount: 0,
      },
      accessControlledScopes:
        scopesResult.data?.authAdminAccessControlledScopes ?? [],
    }
  }
}
