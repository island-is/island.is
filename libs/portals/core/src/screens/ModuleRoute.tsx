import React, { Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { PortalRoute } from '../types/portalCore'
import { usePortalMeta } from '../components/PortalProvider'
import { plausiblePageviewDetail } from '../utils/plausible'
import { Box } from '@island.is/island-ui/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { isCompany } from '@island.is/shared/utils'

type ModuleRouteProps = {
  route: PortalRoute
}

export const ModuleRoute = React.memo(({ route }: ModuleRouteProps) => {
  const location = useLocation()
  const { basePath, portalTitle } = usePortalMeta()
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()

  useEffect(() => {
    if (route.element !== undefined) {
      plausiblePageviewDetail({
        basePath,
        path: route.path,
        entity: isCompany(userInfo) ? 'company' : 'person',
      })

      if (route.name && route.path !== '/') {
        document.title = `${formatMessage(route.name)} - ${portalTitle}`
      } else {
        document.title = portalTitle
      }
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
