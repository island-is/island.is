import * as kennitala from 'kennitala'
import { useAuth } from '@island.is/auth/react'
import { User } from '@island.is/shared/types'
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
  if (navItem.navHide) {
    return false
  }

  if (!isModuleChild) {
    const module = modules.find((m) => m.name === navItem.name)

    navItem.enabled =
      module?.enabled?.({
        userInfo: userInfo,
        isCompany: kennitala.isCompany(userInfo.profile.nationalId),
      }) || true
  } else {
    const route = routes.find((route) => route.path === navItem.path)

    navItem.enabled = route?.enabled || true
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
      return {
        ...masterNav,
        children: masterNav?.children?.filter((navItem) =>
          filterNavigation({
            modules,
            routes,
            userInfo,
            navItem,
            isModuleChild: false,
          }),
        ),
      }
    }

    return undefined
  }, [masterNav, modules, routes, userInfo])

  return navigation
}
