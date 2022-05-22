import cloneDeep from 'lodash/cloneDeep'
import { useEffect, useState } from 'react'

import { useAuth } from '@island.is/auth/react'
import {
  servicePortalMasterNavigation,
  ServicePortalNavigationItem,
  ServicePortalRoute,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { User } from '@island.is/shared/types'

import { useStore } from '../../store/stateProvider'
import { useDynamicRoutes } from '@island.is/service-portal/core'

const filterNavigationTree = (
  item: ServicePortalNavigationItem,
  routes: ServicePortalRoute[],
  userInfo: User,
  dymamicRouteArray: ServicePortalPath[],
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

  // Hides item from navigation
  item.navHide = (routeItem?.navHide ?? item.navHide) || routeItem?.dynamic

  // Makes dynamic item visible in navigation after dynamicArray hook is run
  const solidPath = Array.isArray(routeItem?.path)
    ? routeItem?.path[0]
    : routeItem?.path
  item.navHide =
    routeItem?.dynamic && solidPath && !dymamicRouteArray?.includes(solidPath)

  return included || onlyDescendantsIncluded
}

/**
 * Returns an active navigation that matches all defined module routes
 */
const useNavigation = () => {
  const { userInfo } = useAuth()
  const [{ routes }] = useStore()
  const { activeDynamicRoutes } = useDynamicRoutes()
  const [activeNavigation, setActiveNavigation] = useState<
    ServicePortalNavigationItem[]
  >([])

  useEffect(() => {
    if (userInfo === null) return
    const masterNav: ServicePortalNavigationItem[] = cloneDeep(
      servicePortalMasterNavigation,
    )
    masterNav.filter((rootItem) =>
      filterNavigationTree(rootItem, routes, userInfo, activeDynamicRoutes),
    )

    setActiveNavigation(masterNav)
  }, [routes, userInfo, activeDynamicRoutes])

  return activeNavigation
}

export default useNavigation
