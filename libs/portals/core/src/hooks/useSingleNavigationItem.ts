import concat from 'lodash/concat'

import { useNavigation } from './useNavigation'
import { PortalNavigationItem } from '../types/portalCore'

/**
 * Accepts one or more arrays of PortalNavigationItem and checks
 * if the filtered navigation results in a single child item.
 *  - If the filtered navigation results in a single child item, the item is returned.
 *  - If the filtered navigation results in multiple children items, null is returned.
 *  - If the filtered navigation results in no child item, null is returned.
 *
 * Example usage:
 *    const navItem = useSingleNavigationItem(TOP_NAVIGATION, BOTTOM_NAVIGATION)
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
 *    const navItem = useSingleNavigationItem(TOP_NAVIGATION, BOTTOM_NAVIGATION)
 *    const hasSingleItemAccess = !!navItem
 *
 *    return hasSingleItemAccess ? (
 *      // something specific for single module
 *    ) : (
 *      // something for multiple modules
 *    )
 *
 * @param navigationTrees
 */
export const useSingleNavigationItem = (
  ...navigationTrees: PortalNavigationItem[]
): PortalNavigationItem | null => {
  const combinedNavigation: PortalNavigationItem = {
    name: 'Combined navigation',
    // Combine all navigation trees into single item with combined children
    children: concat([], ...navigationTrees.map((tree) => tree.children ?? [])),
  }

  // Filter out all items that are not accessible or enabled
  const filteredNavigation = useNavigation(combinedNavigation)

  return filteredNavigation?.children?.length === 1
    ? filteredNavigation.children[0]
    : null
}
