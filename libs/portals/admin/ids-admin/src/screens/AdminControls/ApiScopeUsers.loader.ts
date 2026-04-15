import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetApiScopeUsersDocument,
  GetApiScopeUsersQuery,
  GetAccessControlledScopesDocument,
  GetAccessControlledScopesQuery,
  GetConfiguredEnvironmentsDocument,
  GetConfiguredEnvironmentsQuery,
} from './ApiScopeUsers.generated'

export interface ApiScopeUsersLoaderData {
  users: GetApiScopeUsersQuery['authAdminApiScopeUsers']
  accessControlledScopes: GetAccessControlledScopesQuery['authAdminAccessControlledScopes']
  configuredEnvironments: GetConfiguredEnvironmentsQuery['authAdminApiScopeUserConfiguredEnvironments']
}

export const apiScopeUsersLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ request }): Promise<ApiScopeUsersLoaderData> => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const search = url.searchParams.get('search') ?? ''

    const [usersResult, scopesResult, envsResult] = await Promise.all([
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
      client.query<GetConfiguredEnvironmentsQuery>({
        query: GetConfiguredEnvironmentsDocument,
        fetchPolicy: 'network-only',
      }),
    ])

    if (usersResult.error) {
      throw usersResult.error
    }

    if (envsResult.error) {
      console.error('Failed to fetch configured environments', envsResult.error)
    }

    return {
      users: usersResult.data?.authAdminApiScopeUsers ?? {
        rows: [],
        totalCount: 0,
      },
      accessControlledScopes:
        scopesResult.data?.authAdminAccessControlledScopes ?? [],
      configuredEnvironments:
        envsResult.data?.authAdminApiScopeUserConfiguredEnvironments ?? [],
    }
  }
}
