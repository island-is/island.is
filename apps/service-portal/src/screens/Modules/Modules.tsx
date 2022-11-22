import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { FC, Suspense, useEffect, useMemo, useState } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'

import { Box } from '@island.is/island-ui/core'
import {
  AccessDenied,
  NotFound,
  PlausiblePageviewDetail,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { User } from '@island.is/shared/types'
import { useModuleProps } from '../../hooks/useModuleProps/useModuleProps'
import { useStore } from '../../store/stateProvider'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { SettingKeyValue } from '@island.is/feature-flags'

const RouteComponent: FC<{
  route: ServicePortalRoute
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ route, userInfo, client }) => {
  const location = useLocation()

  useEffect(() => {
    if (route.render !== undefined) {
      PlausiblePageviewDetail(route.path)
    }
  }, [location])
  if (route.render === undefined) return null

  const App = route.render({
    userInfo,
    client,
  })

  if (App)
    return (
      <Suspense fallback={null}>
        <ModuleErrorBoundary name={route.name}>
          <App userInfo={userInfo} client={client} />
        </ModuleErrorBoundary>
      </Suspense>
    )

  return <ModuleErrorScreen name={route.name} />
})

const RouteLoader: FC<{
  routes: ServicePortalRoute[]
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ routes, userInfo, client }) => {
  const featureFlagClient = useFeatureFlagClient()
  const [flags, setFlags] = useState<SettingKeyValue[] | null>(null)

  const routesWithFeatureFlags = useMemo(
    () => routes.filter((route) => route.featureFlag),
    [routes],
  )

  const hasFeatureFlags = routesWithFeatureFlags.length > 0

  useEffect(() => {
    featureFlagClient.getAllValues().then()

    // declare the data fetching function
    const fetchFlags = async () => {
      const flags = await featureFlagClient.getAllValues()

      setFlags(flags)
    }

    if (hasFeatureFlags) {
      fetchFlags()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFeatureFlags])

  if (hasFeatureFlags && flags === null) {
    return null
  }

  const isFeatureFlagDisabled = (route: ServicePortalRoute) => {
    if (flags) {
      return flags?.some(
        (flag) =>
          flag.settingKey === route.featureFlag && flag.settingValue === false,
      )
    }

    return false
  }

  return (
    <Switch>
      {routes.map((route) =>
        route.enabled === false ||
        (hasFeatureFlags && isFeatureFlagDisabled(route)) ? (
          <Route
            path={route.path}
            exact
            key={Array.isArray(route.path) ? route.path[0] : route.path}
            component={AccessDenied}
          />
        ) : (
          <Route
            path={route.path}
            exact
            key={Array.isArray(route.path) ? route.path[0] : route.path}
            render={() => (
              <RouteComponent
                route={route}
                userInfo={userInfo}
                client={client}
              />
            )}
          />
        ),
      )}
      {routes.length > 0 && <Route component={NotFound} />}
    </Switch>
  )
})

const Modules = () => {
  const [{ routes }] = useStore()
  const { userInfo, client } = useModuleProps()

  return (
    <Box paddingY={1}>
      {userInfo && (
        <RouteLoader routes={routes} userInfo={userInfo} client={client} />
      )}
    </Box>
  )
}

export default Modules
