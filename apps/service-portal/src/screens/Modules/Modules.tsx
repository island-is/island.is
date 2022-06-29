import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { FC, Suspense, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'

import { Box } from '@island.is/island-ui/core'
import {
  AccessDenied,
  AccessDeniedLegal,
  NotFound,
  PlausiblePageviewDetail,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { User } from '@island.is/shared/types'
import { useModuleProps } from '../../hooks/useModuleProps/useModuleProps'
import { useStore } from '../../store/stateProvider'
import ModuleErrorScreen, { ModuleErrorBoundary } from './ModuleErrorScreen'
import differenceInYears from 'date-fns/differenceInYears'

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

const isLegalAndOver15 = (userInfo: User) => {
  const isLegal = userInfo.profile.delegationType?.includes('LegalGuardian')
  const dateOfBirth = userInfo?.profile.dateOfBirth
  let isOver15 = false
  if (dateOfBirth) {
    isOver15 = differenceInYears(new Date(), dateOfBirth) > 15
  }
  return isLegal && isOver15
}
const RouteLoader: FC<{
  routes: ServicePortalRoute[]
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ routes, userInfo, client }) => {
  const showAccessDeniedLegal = isLegalAndOver15(userInfo)
  return (
    <Switch>
      {routes.map((route) =>
        route.enabled === false ? (
          showAccessDeniedLegal ? (
            <Route
              key={Array.isArray(route.path) ? route.path[0] : route.path}
              path={route.path}
              component={AccessDeniedLegal}
            />
          ) : (
            <Route
              key={Array.isArray(route.path) ? route.path[0] : route.path}
              path={route.path}
              component={AccessDenied}
            />
          )
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

const Modules: FC<{}> = () => {
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
