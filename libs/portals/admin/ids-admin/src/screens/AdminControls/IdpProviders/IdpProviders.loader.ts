import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetIdpProvidersDocument,
  GetIdpProvidersQuery,
  GetIdpProviderConfiguredEnvironmentsDocument,
  GetIdpProviderConfiguredEnvironmentsQuery,
} from './IdpProviders.generated'

export interface IdpProvidersLoaderData {
  idpProviders: GetIdpProvidersQuery['authAdminIdpProviders']
  configuredEnvironments: GetIdpProviderConfiguredEnvironmentsQuery['authAdminIdpProviderConfiguredEnvironments']
}

export const idpProvidersLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ request }): Promise<IdpProvidersLoaderData> => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const search = url.searchParams.get('search') ?? ''

    const [idpProvidersResult, envsResult] = await Promise.all([
      client.query<GetIdpProvidersQuery>({
        query: GetIdpProvidersDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: {
            searchString: search,
            page,
            count: 20,
          },
        },
      }),
      client.query<GetIdpProviderConfiguredEnvironmentsQuery>({
        query: GetIdpProviderConfiguredEnvironmentsDocument,
        fetchPolicy: 'network-only',
      }),
    ])

    if (idpProvidersResult.error) {
      throw idpProvidersResult.error
    }

    if (envsResult.error) {
      console.error('Failed to fetch configured environments', envsResult.error)
    }

    return {
      idpProviders: idpProvidersResult.data?.authAdminIdpProviders ?? {
        rows: [],
        totalCount: 0,
      },
      configuredEnvironments:
        envsResult.data?.authAdminIdpProviderConfiguredEnvironments ?? [],
    }
  }
}
