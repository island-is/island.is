import {
  Outlet,
  useNavigate,
  useLocation,
  matchPath,
  useMatches,
} from 'react-router-dom'
import { Button, Stack } from '@island.is/island-ui/core'
import { replaceParams } from '@island.is/react-spa/shared'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { IDSAdminRouteHandle } from '../module'
import { IDSAdminPaths } from '../lib/paths'

const IDSAdmin = () => {
  const { formatMessage } = useLocale()
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
    <Stack space={'gutter'}>
      {showBackButton && (
        <Button
          colorScheme="default"
          iconType="filled"
          onClick={navigateBack}
          preTextIcon="arrowBack"
          preTextIconType="filled"
          size="small"
          type="button"
          variant="text"
        >
          {formatMessage(m.back)}
        </Button>
      )}

      <Outlet />
    </Stack>
  )
}

export default IDSAdmin
