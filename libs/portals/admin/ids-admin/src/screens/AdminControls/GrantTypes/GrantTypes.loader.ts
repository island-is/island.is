import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetGrantTypesDocument,
  GetGrantTypesQuery,
  GetGrantTypeConfiguredEnvironmentsDocument,
  GetGrantTypeConfiguredEnvironmentsQuery,
} from './GrantTypes.generated'

export interface GrantTypesLoaderData {
  grantTypes: GetGrantTypesQuery['authAdminGrantTypes']
  configuredEnvironments: GetGrantTypeConfiguredEnvironmentsQuery['authAdminGrantTypeConfiguredEnvironments']
}

export const grantTypesLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ request }): Promise<GrantTypesLoaderData> => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const search = url.searchParams.get('search') ?? ''

    const [grantTypesResult, envsResult] = await Promise.all([
      client.query<GetGrantTypesQuery>({
        query: GetGrantTypesDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            searchString: search,
            page,
            count: 20,
          },
        },
      }),
      client.query<GetGrantTypeConfiguredEnvironmentsQuery>({
        query: GetGrantTypeConfiguredEnvironmentsDocument,
        fetchPolicy: 'network-only',
      }),
    ])

    if (grantTypesResult.error) {
      throw grantTypesResult.error
    }

    if (envsResult.error) {
      console.error(
        'Failed to fetch configured environments',
        envsResult.error,
      )
    }

    return {
      grantTypes: grantTypesResult.data?.authAdminGrantTypes ?? {
        rows: [],
        totalCount: 0,
      },
      configuredEnvironments:
        envsResult.data?.authAdminGrantTypeConfiguredEnvironments ?? [],
    }
  }
}
