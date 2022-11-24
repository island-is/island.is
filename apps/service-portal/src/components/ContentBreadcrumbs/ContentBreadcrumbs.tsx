import { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import { Link, match, matchPath, useLocation } from 'react-router-dom'

import {
  Box,
  BreadcrumbsDeprecated as Breadcrumbs,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'

import useNavigation from '../../hooks/useNavigation/useNavigation'
import { isDefined } from '@island.is/shared/utils'

interface ContentBreadcrumb {
  name: string | MessageDescriptor
  path?: string
  hidden?: boolean
}

/**
 * navItem.name can be set as a key of path parameter.
 * This parses the activePath to check if to use route
 * param instead of navItem name.
 */
const parseNavItemName = (
  navItem: ServicePortalNavigationItem,
  activePath: match<Record<string, string>> | null,
) => {
  if (activePath && activePath.params && typeof navItem.name === 'string') {
    return activePath.params[navItem.name] || navItem.name
  }

  return navItem.name
}

/**
 * Will explore all paths of the navigation tree
 * and select the deepest path with an exact path
 * match as the Breadcrumbs to render.
 */
const ContentBreadcrumbs: FC = () => {
  const navigation = useNavigation()
  const location = useLocation()
  const { formatMessage } = useLocale()
  let items: ContentBreadcrumb[] = []

  const findBreadcrumbsPath = (
    navItem: ServicePortalNavigationItem,
    currentBreadcrumbs: ContentBreadcrumb[],
  ) => {
    if (navItem) {
      // Check if the current navItem is the active browser path
      const activePath = matchPath(location.pathname, {
        path: navItem.path,
        exact: true,
      })

      // Push the nav item to the current array as we are currently located here in our search
      currentBreadcrumbs.push({
        name: parseNavItemName(navItem, activePath),
        hidden: navItem.breadcrumbHide ?? false,
        path: activePath ? location.pathname : navItem.path,
      })

      // Only update if we have found a deeper path
      if (activePath && currentBreadcrumbs.length > items.length) {
        items = [...currentBreadcrumbs]
      }

      // Explore all of the childrens
      if (navItem.children && navItem.children.length) {
        for (const children of navItem.children) {
          findBreadcrumbsPath(children, currentBreadcrumbs)
        }
      }

      // Pop the nav item back of the array before we move on to the next item at the same level
      currentBreadcrumbs.pop()
    }
  }

  findBreadcrumbsPath(navigation[0], [])

  if (items.length < 2) return null

  return (
    <Box paddingTop={[0, 3]} paddingBottom={[2, 3]}>
      <Breadcrumbs color="blue400" separatorColor="blue400">
        {items.map((item, index) =>
          isDefined(item.path) && !item.hidden ? (
            <Link key={index} to={item.path}>
              {formatMessage(item.name)}
            </Link>
          ) : null,
        )}
      </Breadcrumbs>
    </Box>
  )
}

export default ContentBreadcrumbs
