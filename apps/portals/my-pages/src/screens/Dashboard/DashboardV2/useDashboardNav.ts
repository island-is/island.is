import { useQuery } from '@apollo/client'
import { Query, QueryGetNamespaceArgs } from '@island.is/api/schema'
import { PortalNavigationItem } from '@island.is/portals/core'
import {
  GET_NAMESPACE_QUERY,
  parseMenuConfig,
  useDynamicRoutesWithNavigation,
} from '@island.is/portals/my-pages/core'
import { DocumentsPaths } from '@island.is/portals/my-pages/documents'
import { MAIN_NAVIGATION } from '../../../lib/masterNavigation'

const DASHBOARD_V2_NAMESPACE = 'Mínar síður Ísland.is flokkar og röðun'
const FALLBACK_FEATURED_COUNT = 3

export const useDashboardNav = () => {
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const children = (navigation?.children ?? []).filter(
    (item) =>
      (!item.navHide || item.customShortcut) &&
      item.path &&
      item.path !== DocumentsPaths.ElectronicDocumentsRoot,
  )

  // Temporary handling of the navigation ordering until we can remove DashboardV1
  // and only use the new Dashboard ordering for everything
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

  const itemByPath = new Map(children.map((item) => [item.path, item]))

  const featured =
    featuredPaths.length > 0
      ? featuredPaths
          .map((path) => itemByPath.get(path))
          .filter((item): item is PortalNavigationItem => item !== undefined)
      : children.slice(0, FALLBACK_FEATURED_COUNT)

  const featuredPathSet = new Set(featured.map((item) => item.path))

  const rest =
    menuOrder.length > 0
      ? menuOrder
          .map((path) => itemByPath.get(path))
          .filter(
            (item): item is PortalNavigationItem =>
              item !== undefined && !featuredPathSet.has(item.path),
          )
      : children.filter((item) => !featuredPathSet.has(item.path))

  return { featured, rest }
}
