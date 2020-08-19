import { useState, useEffect } from 'react'
import {
  ServicePortalNavigationItem,
  ServicePortalModule,
} from '@island.is/service-portal/core'
import { servicePortalMasterNavigation } from '@island.is/service-portal/constants'
import { useStore } from '../../store/stateProvider'
import { JwtToken } from '../../mirage-server/models/jwt-model'

const tempClone = (item) => JSON.parse(JSON.stringify(item))

const filterNavigationTree = (
  item: ServicePortalNavigationItem,
  modules: ServicePortalModule[],
  userInfo: JwtToken,
) => {
  // TODO: Each module's route function has already been called in Modules.tsx
  // This should be combined in some way so that we are not calling the same function twice for no reason
  // A solution might be to define a specific navigation hook that takes care of updating the store with correct routes
  const included = modules.find((x) =>
    x.routes(userInfo).find((route) => route.path === item.path),
  )

  if (item.children) {
    // Filters out any children that do not have a module route defined
    item.children = item.children.filter((child) => {
      return filterNavigationTree(child, modules, userInfo)
    })
  }

  return included
}

/**
 * TODO:
 * This approach carries a certain flaw within itself
 * The only way to display a route within the navigation tree is for a module
 * to define a route for it.
 * This becomes a problem when a certain module wants to route to it's own route
 * and delegate routing within itself. Every time we route within the module itself,
 * it gets remounted because we are defining it as it's own path so it gets lazy loaded again.
 * A potential solution to this problem might be that modules expose a property called internalPaths
 * that would list all other routes included in the module that are not listed as standalone routes
 */

/**
 * Returns an active navigation that matches all defined module routes
 */
const useNavigation = () => {
  const [{ modules, userInfo }] = useStore()
  const [activeNavigation, setActiveNavigation] = useState<
    ServicePortalNavigationItem[]
  >([])

  useEffect(() => {
    // TODO: This has to be cloned better
    const masterNav: ServicePortalNavigationItem[] = tempClone(
      servicePortalMasterNavigation,
    )
    masterNav.filter((rootItem) =>
      filterNavigationTree(rootItem, modules, userInfo),
    )
    setActiveNavigation(masterNav)
  }, [modules, userInfo])

  return activeNavigation
}

export default useNavigation
