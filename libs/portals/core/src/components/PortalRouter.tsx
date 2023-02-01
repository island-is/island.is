import React, { useEffect, useState } from 'react'
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useAuth } from '@island.is/auth/react'
import {
  prepareRouterData,
  PortalModule,
  PortalProvider,
  PortalMeta,
  PortalRoute,
} from '@island.is/portals/core'
import { createModuleRoutes } from '../utils/router/createModuleRoutes'

type PortalRouterProps = {
  modules: PortalModule[]
  portalMeta: PortalMeta
  createRoutes(moduleRoutes: RouteObject[]): RouteObject[]
}

export const PortalRouter = ({
  modules,
  portalMeta,
  createRoutes,
}: PortalRouterProps) => {
  const [error, setError] = useState<Error | null>(null)
  const { userInfo } = useAuth()
  const featureFlagClient = useFeatureFlagClient()
  const [routerData, setRouterData] = useState<{
    modules: PortalModule[]
    routes: PortalRoute[]
  } | null>(null)

  useEffect(() => {
    if (userInfo) {
      prepareRouterData({
        userInfo,
        featureFlagClient,
        modules,
      })
        .then((data) => setRouterData(data))
        .catch((err) => setError(err))
    }
  }, [userInfo])

  if (error) {
    throw error
  }

  if (!(userInfo && routerData)) {
    return null
  }

  const moduleRoutes = createModuleRoutes({ ...routerData, userInfo })
  const router = createBrowserRouter(
    [
      {
        element: <PortalProvider meta={portalMeta} {...routerData} />,
        children: createRoutes(moduleRoutes),
      },
    ],
    {
      basename: portalMeta.basePath,
    },
  )

  return <RouterProvider router={router} />
}
