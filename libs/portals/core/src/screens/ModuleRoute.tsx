import React, { Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ModuleErrorScreen } from './ModuleErrorScreen'
import { PortalRoute } from '../types/portalCore'
import { usePortalMeta } from '../components/PortalProvider'
import { plausiblePageviewDetail } from '../utils/plausible'
import { Box } from '@island.is/island-ui/core'

type ModuleRouteProps = {
  route: PortalRoute
}

export const ModuleRoute = React.memo(({ route }: ModuleRouteProps) => {
  const location = useLocation()
  const { basePath } = usePortalMeta()

  useEffect(() => {
    if (route.element !== undefined) {
      plausiblePageviewDetail({
        basePath,
        path: route.path,
      })
    }
  }, [basePath, location, route.path, route.element])

  if (!route.element) {
    return null
  }

  const module = route.element

  if (module) {
    return (
      <Suspense fallback={null}>
        <Box paddingY={1}>{module}</Box>
      </Suspense>
    )
  }

  return (
    <Box paddingY={1}>
      <ModuleErrorScreen name={route.name} />
    </Box>
  )
})
