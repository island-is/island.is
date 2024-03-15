import {
  Outlet,
  useNavigate,
  useLocation,
  matchPath,
  useMatches,
} from 'react-router-dom'

import { Stack } from '@island.is/island-ui/core'
import { replaceParams } from '@island.is/react-spa/shared'
import { BackButton } from '@island.is/portals/admin/core'

import { IDSAdminRouteHandle } from '../module'
import { IDSAdminPaths } from '../lib/paths'

const IDSAdmin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const matches = useMatches()

  /**
   * This helper helps us navigate back to the previous parent route and not sibling route.
   * We use React Router handles to store the back path for each route,
   * since it is not possible to determine sibling route with navigate() method.
   */
  const navigateBack = () => {
    if (location.pathname === IDSAdminPaths.IDSAdmin) {
      navigate('/')
      return
    }

    const backRouteMatch = matches.find(
      (match) =>
        Boolean((match.handle as IDSAdminRouteHandle)?.backPath) &&
        matchPath(
          {
            path: location.pathname,
            end: true,
          },
          match.pathname,
        ),
    )

    const backPath = (backRouteMatch?.handle as IDSAdminRouteHandle).backPath

    if (backRouteMatch && backPath) {
      const backRoutePath = replaceParams({
        href: backPath,
        params: backRouteMatch.params,
      })

      navigate(backRoutePath)

      return
    }

    // Fallback to root ids-admin route
    navigate(IDSAdminPaths.IDSAdmin)
  }

  const showBackButton = location.pathname !== IDSAdminPaths.IDSAdmin

  return (
    <Stack space="gutter">
      {showBackButton && <BackButton onClick={navigateBack} />}
      <Outlet />
    </Stack>
  )
}

export default IDSAdmin
