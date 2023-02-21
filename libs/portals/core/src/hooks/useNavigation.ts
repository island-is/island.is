import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@island.is/auth/react'
import { useRoutes } from '../components/PortalProvider'
import { PortalNavigationItem } from '../types/portalCore'
import { filterNavigationTree } from '../utils/filterNavigationTree/filterNavigationTree'

export const useNavigation = (
  navigation: PortalNavigationItem,
  dynamicRouteArray: string[] = [],
) => {
  const { userInfo } = useAuth()
  const routes = useRoutes()
  const { pathname } = useLocation()

  const filterNavigation = (navigation: PortalNavigationItem) => {
    return {
      ...navigation,
      children: navigation?.children?.filter((navItem) => {
        navItem.children?.forEach((child) => filterNavigation(child))

        return filterNavigationTree({
          item: navItem,
          routes,
          dynamicRouteArray,
          currentLocationPath: pathname,
        })
      }),
    }
  }

  const filteredNavigation = useMemo(() => {
    if (userInfo) {
      return {
        ...navigation,
        children: navigation?.children?.filter(filterNavigation),
      }
    }

    return undefined
  }, [userInfo, navigation, routes, pathname, dynamicRouteArray])

  return filteredNavigation
}
