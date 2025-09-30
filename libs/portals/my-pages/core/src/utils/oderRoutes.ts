import { PortalNavigationItem } from '@island.is/portals/core'

function toOrderArray(input?: string | string[]): string[] {
  if (!input) return []
  if (Array.isArray(input)) return input

  try {
    const parsed = JSON.parse(input)
    if (Array.isArray(parsed)) return parsed as string[]
    if (parsed && Array.isArray((parsed as any).menu))
      return (parsed as any).menu as string[]
  } catch {
    return input
      .split(/[,\n;]/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

export const orderRoutes = (
  nav: PortalNavigationItem,
  orderInput?: string | string[],
): PortalNavigationItem => {
  const orderedArray = toOrderArray(orderInput)

  if (!nav.children || orderedArray.length === 0) {
    return nav
  }

  const sorted = [...nav.children].sort((a, b) => {
    const ia = orderedArray.indexOf(a.path ?? '')
    const ib = orderedArray.indexOf(b.path ?? '')
    const sa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia
    const sb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib
    return sa - sb
  })

  nav.children = sorted.map((child) => orderRoutes(child, orderedArray))
  return nav
}
