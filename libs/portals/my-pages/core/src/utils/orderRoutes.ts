import { PortalNavigationItem } from '@island.is/portals/core'
import { z } from 'zod'

const menuConfigSchema = z.object({
  menu: z.array(z.string()),
})

const collectShortcuts = (
  items: PortalNavigationItem[],
): PortalNavigationItem[] =>
  items.flatMap((item) => {
    const nested = item.children ? collectShortcuts(item.children) : []
    return item.customShortcut
      ? [{ ...item, navHide: true }, ...nested]
      : nested
  })

export const orderRoutes = (
  nav: PortalNavigationItem,
  orderInput?: string | string[],
): PortalNavigationItem => {
  try {
    let orderedArray: string[]

    if (Array.isArray(orderInput)) {
      orderedArray = orderInput
    } else if (typeof orderInput === 'string') {
      const menuObject = JSON.parse(orderInput)
      const menu = menuConfigSchema.safeParse(menuObject)
      if (!menu.success) return nav
      orderedArray = menu.data.menu
    } else {
      return nav
    }

    if (!nav.children) return nav
    if (orderedArray.length === 0) return nav

    const byOrder = (a: PortalNavigationItem, b: PortalNavigationItem) => {
      const ia = orderedArray.indexOf(a.path ?? '')
      const ib = orderedArray.indexOf(b.path ?? '')
      const sa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia
      const sb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib
      return sa - sb
    }

    const originalItems = [...nav.children]
      .sort(byOrder)
      .filter((item) => !(item.navHide && item.customShortcut))

    const shortcuts = collectShortcuts(originalItems)
    const seen = new Set<string>()
    const allItems = [...originalItems, ...shortcuts]
      .filter((item) => {
        if (!item.path) return true
        if (seen.has(item.path)) return false
        seen.add(item.path)
        return true
      })
      .sort(byOrder)
    nav.children = allItems.map((child) =>
      child.navHide && child.customShortcut
        ? child
        : orderRoutes(child, orderedArray),
    )
    return nav
  } catch {
    return nav
  }
}
