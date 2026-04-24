import { PortalNavigationItem } from '@island.is/portals/core'
import { z } from 'zod'

const menuConfigSchema = z.object({
  menu: z.array(z.string()).optional(),
  featured: z.array(z.string()).optional(),
})

export type MenuConfig = z.infer<typeof menuConfigSchema>

export const parseMenuConfig = (
  orderInput?: string | string[],
): MenuConfig => {
  if (Array.isArray(orderInput)) return { menu: orderInput }
  if (typeof orderInput !== 'string') return { menu: [] }
  try {
    const result = menuConfigSchema.safeParse(JSON.parse(orderInput))
    return result.success ? result.data : { menu: [] }
  } catch {
    return { menu: [] }
  }
}

const collectShortcuts = (
  items: PortalNavigationItem[],
  parentIcon?: PortalNavigationItem['icon'],
): PortalNavigationItem[] =>
  items.flatMap((item) => {
    const icon = item.icon ?? parentIcon
    const nested = item.children ? collectShortcuts(item.children, icon) : []
    return item.customShortcut
      ? [{ ...item, icon, navHide: true }, ...nested]
      : nested
  })

export const orderRoutes = (
  nav: PortalNavigationItem,
  orderInput?: string | string[],
): PortalNavigationItem => {
  try {
    if (!nav.children) return nav

    const { menu: orderedArray = [] } = parseMenuConfig(orderInput)

    const byOrder = (a: PortalNavigationItem, b: PortalNavigationItem) => {
      if (orderedArray.length === 0) return 0
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
