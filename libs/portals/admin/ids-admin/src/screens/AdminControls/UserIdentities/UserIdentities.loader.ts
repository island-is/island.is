import type { WrappedLoaderFn } from '@island.is/portals/core'

import {
  GetUserIdentitiesDocument,
  GetUserIdentitiesQuery,
  GetUserIdentityConfiguredEnvironmentsDocument,
  GetUserIdentityConfiguredEnvironmentsQuery,
} from './UserIdentities.generated'

export interface UserIdentitiesLoaderData {
  userIdentities: GetUserIdentitiesQuery['authAdminUserIdentities']
  configuredEnvironments: GetUserIdentityConfiguredEnvironmentsQuery['authAdminUserIdentityConfiguredEnvironments']
  search: string
}

export const userIdentitiesLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ request }): Promise<UserIdentitiesLoaderData> => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.trim() ?? ''

    const envsPromise =
      client.query<GetUserIdentityConfiguredEnvironmentsQuery>({
        query: GetUserIdentityConfiguredEnvironmentsDocument,
        fetchPolicy: 'network-only',
      })

    // Empty search ⇒ skip the user query entirely, the screen renders an empty
    // state until the user enters something.
    if (!search) {
      const envsResult = await envsPromise
      if (envsResult.error) {
        console.error(
          'Failed to fetch configured environments',
          envsResult.error,
        )
      }
      return {
        userIdentities: [],
        configuredEnvironments:
          envsResult.data?.authAdminUserIdentityConfiguredEnvironments ?? [],
        search,
      }
    }

    const [userIdentitiesResult, envsResult] = await Promise.all([
      client.query<GetUserIdentitiesQuery>({
        query: GetUserIdentitiesDocument,
        fetchPolicy: 'network-only',
        variables: {
          input: { searchString: search },
        },
      }),
      envsPromise,
    ])

    if (userIdentitiesResult.error) {
      throw userIdentitiesResult.error
    }

    if (envsResult.error) {
      console.error('Failed to fetch configured environments', envsResult.error)
    }

    return {
      userIdentities: userIdentitiesResult.data?.authAdminUserIdentities ?? [],
      configuredEnvironments:
        envsResult.data?.authAdminUserIdentityConfiguredEnvironments ?? [],
      search,
    }
  }
}
