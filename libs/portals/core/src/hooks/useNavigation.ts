import { useAuth } from '@island.is/auth/react'
import { User } from '@island.is/shared/types'
import { useMemo } from 'react'
import { usePortalMeta, useRoutes } from '../components/PortalProvider'
import { PortalNavigationItem, PortalRoute } from '../types/portalCore'

const filterNavigationTree = (
  item: PortalNavigationItem,
  routes: PortalRoute[],
  userInfo: User,
  dymamicRouteArray: string[],
): boolean => {
  const routeItem = routes.find(
    (route) =>
      route.path === item.path ||
      (Array.isArray(route.path) &&
        item.path &&
        route.path.includes(item.path)),
  )

  const included = routeItem !== undefined || item.systemRoute === true

  // Filters out any children that do not have a module route defined
  item.children = item.children?.filter((child) => {
    return filterNavigationTree(child, routes, userInfo, dymamicRouteArray)
  })

  // If the item is not included but one or more of it's descendants are
  // We remove the item's path but include it in the tree
  const onlyDescendantsIncluded =
    !included && Array.isArray(item.children) && item.children.length > 0
  if (onlyDescendantsIncluded) item.path = undefined

  // Maps the enabled status to the nav item if provided
  item.enabled = routeItem?.enabled
  // Makes dynamic item visible in navigation after dynamicArray hook is run
  const solidPath = Array.isArray(routeItem?.path)
    ? routeItem?.path[0]
    : routeItem?.path
  const hideDynamicPath =
    routeItem?.dynamic && solidPath && !dymamicRouteArray?.includes(solidPath)

  // Hides item from navigation

  if (routeItem?.navHide) {
    item.navHide = routeItem.navHide
  }

  item.navHide = item.navHide || !!hideDynamicPath

  return included || onlyDescendantsIncluded
}

export const useNavigation = (navigation?: PortalNavigationItem) => {
  const { userInfo } = useAuth()
  const { masterNav } = usePortalMeta()
  const routes = useRoutes()

  const filteredNavigation = useMemo(() => {
    if (userInfo) {
      const nav = navigation || masterNav

      return {
        ...nav,
        children: nav?.children?.filter((navItem) =>
          filterNavigationTree(navItem, routes, userInfo, []),
        ),
      }
    }

    return undefined
  }, [masterNav, routes, userInfo, navigation])

  return filteredNavigation
}
