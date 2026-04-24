import { useQuery } from '@apollo/client'
import { Query, QueryGetNamespaceArgs } from '@island.is/api/schema'
import { PortalNavigationItem } from '@island.is/portals/core'
import {
  GET_NAMESPACE_QUERY,
  ServicePortalPaths,
  parseMenuConfig,
  useDynamicRoutesWithNavigation,
} from '@island.is/portals/my-pages/core'
import { DocumentsPaths } from '@island.is/portals/my-pages/documents'
import { MAIN_NAVIGATION } from '../../../lib/masterNavigation'

const DASHBOARD_V2_NAMESPACE = 'Mínar síður Ísland.is flokkar og röðun'

export const useDashboardNav = () => {
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const children = navigation?.children ?? []

  const { data: configData } = useQuery<Query, QueryGetNamespaceArgs>(
    GET_NAMESPACE_QUERY,
    {
      variables: {
        input: { namespace: DASHBOARD_V2_NAMESPACE, lang: 'is-IS' },
      },
    },
  )

  const { featured: featuredPaths = [], menu: menuOrder = [] } =
    parseMenuConfig(configData?.getNamespace?.fields)

  // When Contentful has a featured list, it is the sole source of truth for
  // what is featured and in what order. Falls back to nav-file flags while
  // the Contentful entry is not yet set up.
  const isFeatured = (item: PortalNavigationItem): boolean =>
    featuredPaths.length > 0
      ? featuredPaths.includes(item.path ?? '')
      : item.featured === true || item.customShortcut?.featured === true

  const featuredMap = new Map(children.map((item) => [item.path, item]))
  const featured =
    featuredPaths.length > 0
      ? featuredPaths
          .map((path) => featuredMap.get(path))
          .filter((item): item is PortalNavigationItem => item !== undefined)
      : children.filter(
          (item) => item.featured || item.customShortcut?.featured,
        )

  // When Contentful has a menu list for V2, use it to re-order the module
  // grid independently of the V1 ordering. Falls back to the order already
  // applied by orderRoutes (V1 namespace) when not set.
  const rest = children
    .filter(
      (item) =>
        !isFeatured(item) &&
        (!item.navHide || item.customShortcut) &&
        item.path !== ServicePortalPaths.Root &&
        item.path !== DocumentsPaths.ElectronicDocumentsRoot,
    )
    .sort((a, b) => {
      if (menuOrder.length === 0) return 0
      const ia = menuOrder.indexOf(a.path ?? '')
      const ib = menuOrder.indexOf(b.path ?? '')
      return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib)
    })

  return { featured, rest }
}
