import { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import { Link, useLocation, PathMatch, matchPath } from 'react-router-dom'
import { useWindowSize } from 'react-use'

import {
  Box,
  BreadcrumbsDeprecated as Breadcrumbs,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  GoBack,
  ServicePortalNavigationItem,
  m,
  useDynamicRoutesWithNavigation,
} from '@island.is/portals/my-pages/core'
import { theme } from '@island.is/island-ui/theme'

import { isDefined } from '@island.is/shared/utils'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import * as styles from './ContentBreadcrumbs.css'
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
  activePath: PathMatch<string> | null,
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
const ContentBreadcrumbs: FC<React.PropsWithChildren<unknown>> = () => {
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const location = useLocation()
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  let items: ContentBreadcrumb[] = []

  const findBreadcrumbsPath = (
    navItem: ServicePortalNavigationItem | undefined,
    currentBreadcrumbs: ContentBreadcrumb[],
  ) => {
    if (navItem) {
      // Check if the current navItem is the active browser path
      const activePath = navItem.path
        ? matchPath(
            {
              path: navItem.path,
              end: true,
            },
            location.pathname,
          )
        : null

      // Use active ancestor to fill in parameter references for ancestors.
      const activeAncestor = navItem.path
        ? matchPath(
            {
              path: navItem.path,
              end: false,
            },
            location.pathname,
          )
        : null

      // Push the nav item to the current array as we are currently located here in our search
      currentBreadcrumbs.push({
        name: parseNavItemName(navItem, activeAncestor),
        hidden: navItem.breadcrumbHide ?? false,
        path: activeAncestor ? activeAncestor.pathname : navItem.path,
      })

      // Only update if we have found a deeper path
      if (activePath && currentBreadcrumbs.length > items.length) {
        items = [...currentBreadcrumbs]
      }

      // Explore all of the children
      if (navItem.children && navItem.children.length) {
        for (const children of navItem.children) {
          findBreadcrumbsPath(children, currentBreadcrumbs)
        }
      }

      // Pop the nav item back of the array before we move on to the next item at the same level
      currentBreadcrumbs.pop()
    }
  }

  findBreadcrumbsPath(navigation, [])
  const isMobile = width < theme.breakpoints.md
  if (items.length < 2) return null
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="spaceBetween"
      alignItems="center"
      paddingBottom={[2, 3]}
      paddingTop={[4, 4, 0]}
    >
      <Box className={styles.breadcrumbs} paddingTop={0} position="relative">
        <Breadcrumbs color="blue400" separatorColor="blue400">
          {items.map((item, index) =>
            isDefined(item.path) && !item.hidden ? (
              isMobile && index === 0 ? (
                <GoBack noUnderline={true} display="inline" key="goback" />
              ) : (
                <Link className={styles.link} key={index} to={item.path}>
                  {index === 0
                    ? formatMessage(m.overview)
                    : formatMessage(item.name)}
                </Link>
              )
            ) : null,
          )}
        </Breadcrumbs>
      </Box>
    </Box>
  )
}

export default ContentBreadcrumbs
