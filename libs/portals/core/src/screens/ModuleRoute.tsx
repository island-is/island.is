import React, { Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { User } from '@island.is/shared/types'
import { ModuleErrorScreen, ModuleErrorBoundary } from './ModuleErrorScreen'
import { PortalRoute } from '../types/portalCore'
import { usePortalMeta } from '../components/PortalProvider'
import { plausiblePageviewDetail } from '../utils/plausible'
import { Box } from '@island.is/island-ui/core'

type ModuleRouteProps = {
  route: PortalRoute
  userInfo: User
}

export const ModuleRoute = React.memo(
  ({ route, userInfo }: ModuleRouteProps) => {
    const location = useLocation()
    const { basePath } = usePortalMeta()

    useEffect(() => {
      if (route.render !== undefined) {
        plausiblePageviewDetail({
          basePath,
          path: route.path,
        })
      }
    }, [basePath, location, route.path, route.render])

    if (route.render === undefined) {
      return null
    }

    const Module = route.render({
      userInfo,
    })

    if (Module)
      return (
        <Suspense fallback={null}>
          <Box paddingY={1}>
            <ModuleErrorBoundary name={route.name}>
              <Module userInfo={userInfo} />
            </ModuleErrorBoundary>
          </Box>
        </Suspense>
      )

    return (
      <Box paddingY={1}>
        <ModuleErrorScreen name={route.name} />
      </Box>
    )
  },
)
