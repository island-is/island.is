import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { BffUser } from '@island.is/shared/types'
import { isCompany } from '@island.is/shared/utils'

import {
  AuthScopeDelegationSettingsDocument,
  AuthScopeDelegationSettingsQuery,
  AuthScopeDelegationSettingsQueryVariables,
} from '../../queries/ScopeDelegationSettings.generated'
import { PortalRoute } from '../../types/portalCore'

const collectRequiredScopes = (routes: PortalRoute[]): string[] =>
  routes.flatMap((route) => [
    ...(route.requiredScopes ?? []),
    ...collectRequiredScopes(route.children ?? []),
  ])

const mapRoutes = (
  routes: PortalRoute[],
  map: (route: PortalRoute) => PortalRoute,
): PortalRoute[] =>
  routes.map((route) =>
    map({
      ...route,
      ...(route.children && { children: mapRoutes(route.children, map) }),
    }),
  )

export const applyScopeDelegationSettings = async ({
  routes,
  userInfo,
  client,
}: {
  routes: PortalRoute[]
  userInfo: BffUser
  client: ApolloClient<NormalizedCacheObject>
}): Promise<PortalRoute[]> => {
  const scopes = [...new Set(collectRequiredScopes(routes))]
  if (!userInfo.profile.actor || scopes.length === 0) {
    return routes
  }

  let requestable: Set<string>
  try {
    const { data } = await client.query<
      AuthScopeDelegationSettingsQuery,
      AuthScopeDelegationSettingsQueryVariables
    >({
      query: AuthScopeDelegationSettingsDocument,
      variables: { input: { scopes } },
    })
    const grantorType = isCompany(userInfo) ? 'company' : 'individual'
    requestable = new Set(
      data.authScopeDelegationSettings
        .filter((settings) => settings.requestable[grantorType])
        .map((settings) => settings.name),
    )
  } catch {
    return mapRoutes(routes, (route) => ({
      ...route,
      requiredScopes: undefined,
    }))
  }

  return mapRoutes(routes, (route) => {
    if (!route.requiredScopes) {
      return route
    }
    const requiredScopes = route.requiredScopes.filter((scope) =>
      requestable.has(scope),
    )
    return requiredScopes.length > 0
      ? { ...route, requiredScopes }
      : { ...route, requiredScopes: undefined, notAvailableForActors: true }
  })
}
