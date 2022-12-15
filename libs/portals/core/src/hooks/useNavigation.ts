import * as kennitala from 'kennitala'
import { useAuth } from '@island.is/auth/react'
import { User } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { useMemo } from 'react'
import { useModules } from '../components/ModulesProvider'
import { usePortalMeta } from '../components/PortalMetaProvider'
import {
  PortalModule,
  PortalNavigationItem,
  PortalRoute,
} from '../types/portalCore'

interface FilterNavigation {
  modules: PortalModule[]
  routes: PortalRoute[]
  navItem: PortalNavigationItem
  isModuleChild: boolean
  userInfo: User
}

const filterNavigation = ({
  modules,
  navItem,
  isModuleChild = false,
  userInfo,
  routes,
}: FilterNavigation) => {
  if (navItem.navHide) return false

  if (!isModuleChild) {
    const module = modules.find((m) => m.name === navItem.name)

    // Check if navItem exists in modules or if navItem is enabled
    if (
      !module ||
      (isDefined(module.enabled) &&
        !module.enabled({
          userInfo: userInfo,
          isCompany: kennitala.isCompany(userInfo.profile.nationalId),
        }))
    ) {
      return false
    }
  } else {
    const route = routes.find((route) => route.path === navItem.path)

    // Check if navItem exists in routes or if navItem is enabled
    if (!route || (isDefined(route.enabled) && !route.enabled)) {
      return false
    }
  }

  // Check if navItem has children
  if (navItem.children?.[0]) {
    // Check if navItem children exists in modules children
    navItem.children = navItem.children?.filter((child) =>
      filterNavigation({
        modules,
        navItem: child,
        isModuleChild: true,
        userInfo,
        routes,
      }),
    )
  }

  return true
}

export const useNavigation = () => {
  const { userInfo } = useAuth()
  const { masterNav } = usePortalMeta()
  const { modules, routes } = useModules()

  const navigation = useMemo(() => {
    if (userInfo) {
      return masterNav?.children?.filter((navItem) =>
        filterNavigation({
          modules,
          routes,
          userInfo,
          navItem,
          isModuleChild: false,
        }),
      )
    }

    return undefined
  }, [masterNav?.children, modules, routes, userInfo])

  return navigation
}
