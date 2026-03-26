import {
  PortalNavigationItem,
  PortalRoute,
  PortalRouteDisabledReason,
} from '../../types/portalCore'
import { matchPath } from 'react-router-dom'
import { AuthDelegationType, BffUser } from '@island.is/shared/types'

const computeDisabledReason = (
  userInfo: BffUser,
  route: PortalRoute,
): PortalRouteDisabledReason => {
  const delegationTypes = userInfo.profile.delegationType ?? []
  const isActingAsDelegate = !!userInfo.profile.actor

  if (isActingAsDelegate && route.notAvailableForActors) {
    return 'notAvailableForActors'
  }

  if (
    delegationTypes.includes(AuthDelegationType.LegalGuardian) &&
    !delegationTypes.includes(AuthDelegationType.LegalGuardianMinor)
  ) {
    return 'notMinor'
  }

  return 'default'
}

type FilterNavigationTree = {
  item: PortalNavigationItem
  routes: PortalRoute[]
  dynamicRouteArray: string[]
  /**
   * The current location path
   */
  currentLocationPath: string
  userInfo?: BffUser
}

const findRoute = (route: PortalRoute, item: PortalNavigationItem) => {
  let children: PortalRoute | undefined
  if (route.children?.length) {
    children = route.children.find((child) => {
      return findRoute(child, item)
    })
  }
  if (route.path === item.path || children) {
    return route
  }
  return undefined
}

export const filterNavigationTree = ({
  item,
  routes,
  dynamicRouteArray,
  currentLocationPath,
  userInfo,
}: FilterNavigationTree): boolean => {
  const routeItem = routes.find((route) => findRoute(route, item))

  const included = routeItem !== undefined || item.systemRoute === true

  // Filters out any children that do not have a module route defined
  item.children = item.children?.filter((child) => {
    return filterNavigationTree({
      item: child,
      routes,
      dynamicRouteArray,
      currentLocationPath,
      userInfo,
    })
  })

  // If the item is not included but one or more of it's descendants are
  // We remove the item's path but include it in the tree
  const onlyDescendantsIncluded =
    !included && Array.isArray(item.children) && item.children.length > 0

  if (onlyDescendantsIncluded) {
    item.path = undefined
  }

  // Maps the enabled status to the nav item if provided
  item.enabled = routeItem?.enabled
  item.disabledReason =
    routeItem?.disabledReason ??
    (routeItem?.enabled === false && userInfo
      ? computeDisabledReason(userInfo, routeItem)
      : undefined)

  // Makes dynamic item visible in navigation after dynamicArray hook is run
  if (routeItem?.dynamic) {
    const solidPath = routeItem?.path

    const showDynamicPath =
      routeItem?.dynamic && solidPath && dynamicRouteArray?.includes(solidPath)

    item.navHide = !showDynamicPath
  }
  // Hides item from navigation

  item.navHide = routeItem?.navHide || !!item.navHide
  if (currentLocationPath) {
    if (item.path) {
      // Set item active if
      // - the item path is an exact match
      // - the item path is a prefix of the current location path
      item.active = item.activeIfExact
        ? !!matchPath(item.path, currentLocationPath)
        : currentLocationPath.startsWith(item.path)
    } else if (!item.path && item?.children) {
      // Set item active if one of it's children is active and the item has no path.
      item.active = item.children.some(({ active }) => active)
    }
  }

  return included || onlyDescendantsIncluded
}
