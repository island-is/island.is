// Shape shared between DesktopNav and MobileNav. Populated by
// `buildHeaderNavData` from the Contentful grouped menu + organization
// logos. The components render nothing when data is missing — no mock
// fallback, so Contentful issues surface immediately.

export type HeaderNavKey = 'organizations' | 'categories' | 'lifeEvents'

export interface HeaderNavItem {
  title: string
  href: string
  // Populated by the Contentful → header-nav mapper for organizationPage
  // links — surfaces a 60x60 org logo next to the item in the Stofnanir
  // section. Undefined for non-org links.
  logoUrl?: string
}

export interface HeaderNavSection {
  label: string
  title: string
  items: HeaderNavItem[]
  seeAllHref: string
  seeAllLabel: string
}

export type HeaderNavData = Record<HeaderNavKey, HeaderNavSection>

export const HEADER_NAV_KEYS: HeaderNavKey[] = [
  'organizations',
  'categories',
  'lifeEvents',
]

export const HEADER_NAV_MAX_ITEMS = 8

// Contentful namespace keys for the per-section "see all" labels. Used by
// both DesktopNav and MobileNav to override the hardcoded fallbacks in
// buildHeaderNavData without duplicating the mapping.
export const HEADER_NAV_SEE_ALL_LABEL_KEYS: Record<HeaderNavKey, string> = {
  organizations: 'headerNavSeeAllOrganizationsLabel',
  categories: 'headerNavSeeAllCategoriesLabel',
  lifeEvents: 'headerNavSeeAllLifeEventsLabel',
}
