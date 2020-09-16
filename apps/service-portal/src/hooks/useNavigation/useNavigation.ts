import { useState, useEffect } from 'react'
import {
  ServicePortalNavigationItem,
  servicePortalMasterNavigation,
  ServicePortalRoute,
  UserWithMeta,
} from '@island.is/service-portal/core'
import { useStore } from '../../store/stateProvider'
import { cloneDeep } from 'lodash'

const filterNavigationTree = (
  item: ServicePortalNavigationItem,
  routes: ServicePortalRoute[],
  userInfo: UserWithMeta,
): boolean => {
  const included = routes.find(
    (route) =>
      route.path === item.path ||
      (Array.isArray(route.path) &&
        item.path &&
        route.path.includes(item.path)),
  )

  // Filters out any children that do not have a module route defined
  item.children = item.children?.filter((child) => {
    return filterNavigationTree(child, routes, userInfo)
  })

  // If the item is not included but one or more of it's descendants are
  // We remove the item's path but include it in the tree
  const onlyDescendantsIncluded =
    !included && Array.isArray(item.children) && item.children.length > 0
  if (onlyDescendantsIncluded) item.path = undefined

  return included !== undefined || onlyDescendantsIncluded
}

/**
 * Returns an active navigation that matches all defined module routes
 */
const useNavigation = () => {
  const [{ userInfo, routes }] = useStore()
  const [activeNavigation, setActiveNavigation] = useState<
    ServicePortalNavigationItem[]
  >([])

  useEffect(() => {
    if (userInfo === null) return
    const masterNav: ServicePortalNavigationItem[] = cloneDeep(
      servicePortalMasterNavigation,
    )
    masterNav.filter((rootItem) =>
      filterNavigationTree(rootItem, routes, userInfo),
    )
    setActiveNavigation(masterNav)
  }, [routes, userInfo])

  return activeNavigation
}

export default useNavigation
