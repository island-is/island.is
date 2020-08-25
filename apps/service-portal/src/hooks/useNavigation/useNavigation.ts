import { useState, useEffect } from 'react'
import {
  ServicePortalNavigationItem,
  servicePortalMasterNavigation,
  ServicePortalRoute,
  UserWithMeta,
} from '@island.is/service-portal/core'
import { useStore } from '../../store/stateProvider'

const tempClone = (item) => JSON.parse(JSON.stringify(item))

// TODO: Handle cases where a parent path might not be found in routes
// But a child of it might. In that case the parent should still render in the navigation
// tree but it should not have a path
const filterNavigationTree = (
  item: ServicePortalNavigationItem,
  routes: ServicePortalRoute[],
  userInfo: UserWithMeta,
) => {
  const included = routes.find(
    (route) =>
      route.path === item.path ||
      (Array.isArray(route.path) && route.path.includes(item.path)),
  )

  if (item.children) {
    // Filters out any children that do not have a module route defined
    item.children = item.children.filter((child) => {
      return filterNavigationTree(child, routes, userInfo)
    })
  }

  return included
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
    // TODO: This has to be cloned better
    const masterNav: ServicePortalNavigationItem[] = tempClone(
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
