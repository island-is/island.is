import { PortalNavigationItem } from '../types/portalCore'
import { useNavigation } from '../hooks/useNavigation'

/**
 * Accepts one or more arrays of PortalNavigationItem and returns a single item
 * if they only contains single item in total. If there are more then on time it
 * returns null.
 *
 * Example usage:
 *    const navItem = getNavigationItemIfSingle(TOP_NAVIGATION, BOTTOM_NAVIGATION)
 *
 *    if (navItem) {
 *      // user has only access to single module
 *      return // something specific for single module
 *    }
 *
 *    // user has access to multiple modules
 *    return (
 *      // something for multiple modules
 *    )
 *
 * or:
 *    const hasSingleItemAccess = !!getNavigationItemIfSingle(TOP_NAVIGATION, BOTTOM_NAVIGATION)
 *
 *    return hasSingleItemAccess ? (
 *      // something specific for single module
 *    ) : (
 *      // something for multiple modules
 *    )
 *
 * @param navigations
 */
export const getNavigationItemIfSingle = (
  ...navigations: PortalNavigationItem[]
): PortalNavigationItem | null => {
  const items = navigations.reduce((acc, navigation) => {
    const filteredNav = useNavigation(navigation)
    return [...acc, ...(filteredNav?.children ?? [])]
  }, [] as PortalNavigationItem[])

  return items.length === 1 ? items[0] : null
}
