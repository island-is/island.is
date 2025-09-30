import { PortalNavigationItem } from '@island.is/portals/core'

type MenuConfig = { menu: string[] }

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string')

const isMenuConfig = (v: unknown): v is MenuConfig =>
  typeof v === 'object' &&
  v !== null &&
  'menu' in v &&
  isStringArray((v as Record<string, unknown>).menu)

const toOrderArray = (input?: string | string[]): string[] => {
  if (!input) return []
  if (Array.isArray(input)) return input

  try {
    const parsed: unknown = JSON.parse(input)
    if (isStringArray(parsed)) return parsed
    if (isMenuConfig(parsed)) return parsed.menu
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
  if (!nav.children || orderedArray.length === 0) return nav

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
