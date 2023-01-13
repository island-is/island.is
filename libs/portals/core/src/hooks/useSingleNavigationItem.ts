import concat from 'lodash/concat'

import { useNavigation } from './useNavigation'
import { PortalNavigationItem } from '../types/portalCore'

export enum SingleNavigationItemStatus {
  NO_ITEM = 'no_item',
  SINGLE_ITEM = 'single_item',
  MULTIPLE_ITEMS = 'multiple_items',
}

export interface UseSingleNavigationItemResult {
  navigationItem?: PortalNavigationItem

  status: SingleNavigationItemStatus
}

/**
 * Accepts one or more arrays of PortalNavigationItem and checks
 * if the filtered navigation results in a single child item.
 *  - If the filtered navigation results in a single child item, the item is returned.
 *  - If the filtered navigation results in multiple children items, null is returned.
 *  - If the filtered navigation results in no child item, null is returned.
 *
 * @example Usage
 * const navItem = useSingleNavigationItem(TOP_NAVIGATION, BOTTOM_NAVIGATION)
 * const hasSingleItemAccess = !!navItem
 *
 * return hasSingleItemAccess ? (
 *   // something specific for single module
 * ) : (
 *   // something for multiple modules
 * )
 *
 * @param navigationTrees
 */
export const useSingleNavigationItem = (
  ...navigationTrees: PortalNavigationItem[]
): UseSingleNavigationItemResult => {
  const combinedNavigation: PortalNavigationItem = {
    name: 'Combined navigation',
    // Combine all navigation trees into single item with combined children
    children: concat([], ...navigationTrees.map((tree) => tree.children ?? [])),
  }

  // Filter out all items that are not accessible or enabled
  const filteredNavigation = useNavigation(combinedNavigation)

  const navigationItem =
    filteredNavigation?.children?.length === 1
      ? filteredNavigation.children[0]
      : undefined

  return {
    navigationItem,
    status:
      filteredNavigation?.children && filteredNavigation.children.length > 0
        ? filteredNavigation.children.length === 1
          ? SingleNavigationItemStatus.SINGLE_ITEM
          : SingleNavigationItemStatus.MULTIPLE_ITEMS
        : SingleNavigationItemStatus.NO_ITEM,
  }
}
