import { PortalNavigationItem, PortalRoute } from '../../types/portalCore'

type FilterNavigationTree = {
  item: PortalNavigationItem
  routes: PortalRoute[]
  dynamicRouteArray: string[]
  /**
   * The current location path
   */
  currentLocationPath: string
}

export const filterNavigationTree = ({
  item,
  routes,
  dynamicRouteArray,
  currentLocationPath,
}: FilterNavigationTree): boolean => {
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
    return filterNavigationTree({
      item: child,
      routes,
      dynamicRouteArray,
      currentLocationPath,
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

  // Makes dynamic item visible in navigation after dynamicArray hook is run
  const solidPath = Array.isArray(routeItem?.path)
    ? routeItem?.path[0]
    : routeItem?.path
  const hideDynamicPath =
    routeItem?.dynamic && solidPath && !dynamicRouteArray?.includes(solidPath)

  // Hides item from navigation
  if (routeItem?.navHide) {
    item.navHide = routeItem.navHide
  }

  item.navHide = item.navHide || !!hideDynamicPath

  if (currentLocationPath) {
    if (item.path) {
      // Set item active if
      // - the item path is an exact match
      // - the item path is a prefix of the current location path
      item.active = item.activeIfExact
        ? currentLocationPath === item.path
        : currentLocationPath.startsWith(item.path)
    } else if (!item.path && item?.children) {
      // Set item active if one of it's children is active and the item has no path.
      item.active = item.children.some(({ active }) => active)
    }
  }

  return included || onlyDescendantsIncluded
}
