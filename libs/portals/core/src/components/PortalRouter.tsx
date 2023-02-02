import React, { useEffect, useState } from 'react'
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useAuth } from '@island.is/auth/react'
import { createModuleRoutes } from '../utils/router/createModuleRoutes'
import { PortalModule, PortalRoute } from '../types/portalCore'
import { PortalMeta, PortalProvider } from './PortalProvider'
import { prepareRouterData } from '../utils/router/prepareRouterData'

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
  }, [userInfo, modules, featureFlagClient])

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
