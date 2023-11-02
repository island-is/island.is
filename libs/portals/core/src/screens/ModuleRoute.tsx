import React, { Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PortalRoute } from '../types/portalCore'
import { usePortalMeta } from '../components/PortalProvider'
import { plausiblePageviewDetail } from '../utils/plausible'
import { Box } from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'

type ModuleRouteProps = {
  route: PortalRoute
}

export const ModuleRoute = React.memo(({ route }: ModuleRouteProps) => {
  const location = useLocation()
  const { basePath } = usePortalMeta()
  const { userInfo } = useAuth()

  useEffect(() => {
    if (route.element !== undefined) {
      plausiblePageviewDetail({
        basePath,
        path: route.path,
        entity:
          userInfo?.profile?.subjectType === 'legalEntity'
            ? 'company'
            : 'person',
      })
    }
  }, [basePath, location, route.path, route.element])

  const module = route.element

  if (module) {
    return (
      <Suspense fallback={null}>
        <Box paddingY={1}>{module}</Box>
      </Suspense>
    )
  }

  return null
})
