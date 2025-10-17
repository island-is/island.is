import { PortalNavigationItem } from '@island.is/portals/core'
import { z } from 'zod'

const menuConfigSchema = z.object({
  menu: z.array(z.string()),
})

export const orderRoutes = (
  nav: PortalNavigationItem,
  orderInput?: string | string[],
): PortalNavigationItem => {
  try {
    if (typeof orderInput !== 'string') {
      return nav
    }
    const menuObject = JSON.parse(orderInput)
    const menu = menuConfigSchema.safeParse(menuObject)

    if (!nav.children) return nav
    if (!menu.success) return nav

    const orderedArray = menu.data.menu
    if (orderedArray.length === 0) return nav

    const sorted = [...nav.children].sort((a, b) => {
      const ia = orderedArray.indexOf(a.path ?? '')
      const ib = orderedArray.indexOf(b.path ?? '')
      const sa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia
      const sb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib
      return sa - sb
    })

    nav.children = sorted.map((child) => orderRoutes(child, orderedArray))
    return nav
  } catch {
    return nav
  }
}
