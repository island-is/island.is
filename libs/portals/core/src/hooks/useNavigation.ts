import { useUserInfo } from '@island.is/react-spa/bff'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useRoutes } from '../components/PortalProvider'
import { PortalNavigationItem } from '../types/portalCore'
import { filterNavigationTree } from '../utils/filterNavigationTree/filterNavigationTree'

export const useNavigation = (
  navigation: PortalNavigationItem,
  dynamicRouteArray?: string[],
) => {
  const userInfo = useUserInfo()
  const routes = useRoutes()
  const { pathname } = useLocation()

  const filteredNavigation = useMemo(() => {
    if (userInfo) {
      return {
        ...navigation,
        children: navigation?.children?.filter((navItem) =>
          filterNavigationTree({
            item: navItem,
            routes,
            dynamicRouteArray: dynamicRouteArray ?? [],
            currentLocationPath: pathname,
          }),
        ),
      }
    }

    return undefined
  }, [userInfo, navigation, routes, pathname, dynamicRouteArray])

  return filteredNavigation
}
