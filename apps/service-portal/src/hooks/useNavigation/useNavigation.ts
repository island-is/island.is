import { useState, useEffect } from 'react'
import {
  ServicePortalNavigationItem,
  servicePortalMasterNavigation,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { useStore } from '../../store/stateProvider'
import { User } from 'oidc-client'

const tempClone = (item) => JSON.parse(JSON.stringify(item))

const filterNavigationTree = (
  item: ServicePortalNavigationItem,
  routes: ServicePortalRoute[],
  userInfo: User,
) => {
  const included = routes.find(
    (route) => route.path === item.path || route.path.includes(item.path),
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
