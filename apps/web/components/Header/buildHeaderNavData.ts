import type { Locale } from '@island.is/shared/types'

import type {
  GetGroupedMenuQuery,
  GetOrganizationsQuery,
  Menu,
} from '../../graphql/schema'
import { linkResolver, LinkType } from '../../hooks/useLinkResolver'
import type {
  HeaderNavData,
  HeaderNavItem,
  HeaderNavKey,
  HeaderNavSection,
} from './headerNavData'
import { HEADER_NAV_KEYS, HEADER_NAV_MAX_ITEMS } from './headerNavData'

type Organization = NonNullable<
  NonNullable<GetOrganizationsQuery['getOrganizations']>['items']
>[number]

// Per-section metadata that doesn't live in Contentful: the dropdown title
// suffix, the "see all" link href and the "see all" link label. Keyed by
// HEADER_NAV_KEYS position (menus[0]=organizations, [1]=categories,
// [2]=lifeEvents) — the content team must keep that order when editing
// the grouped menu in Contentful.
const SECTION_CONFIG: Record<
  HeaderNavKey,
  {
    titleSuffix: Record<Locale, string>
    seeAllLabel: Record<Locale, string>
    seeAllHref: Record<Locale, string>
  }
> = {
  organizations: {
    titleSuffix: { is: 'á Ísland.is', en: 'on Ísland.is' },
    seeAllLabel: {
      is: 'Skoða allar stofnanir',
      en: 'View all organizations',
    },
    seeAllHref: { is: '/s', en: '/en/organizations' },
  },
  categories: {
    titleSuffix: { is: 'á Ísland.is', en: 'on Ísland.is' },
    seeAllLabel: {
      is: 'Skoða alla þjónustuflokka',
      en: 'View all categories',
    },
    seeAllHref: { is: '/flokkur', en: '/en/category' },
  },
  lifeEvents: {
    titleSuffix: { is: 'á Ísland.is', en: 'on Ísland.is' },
    seeAllLabel: {
      is: 'Skoða alla lífsviðburði',
      en: 'View all life events',
    },
    seeAllHref: { is: '/lifsvidburdir', en: '/en/life-events' },
  },
}

const ORG_LOGO_TRANSFORM = '?w=60&h=60&fit=pad&bg=white&fm=png'

const buildOrgLogoLookup = (organizations: Organization[]) => {
  const bySlug = new Map<string, string>()
  for (const org of organizations) {
    if (org?.slug && org.logo?.url) {
      bySlug.set(org.slug, `${org.logo.url}${ORG_LOGO_TRANSFORM}`)
    }
  }
  return bySlug
}

const mapMenuToSection = (
  menu: Menu | undefined,
  key: HeaderNavKey,
  locale: Locale,
  orgLogoBySlug: Map<string, string>,
): HeaderNavSection | null => {
  if (!menu) return null

  const config = SECTION_CONFIG[key]
  const label = menu.title ?? ''

  const items: HeaderNavItem[] = (menu.menuLinks ?? [])
    .filter((link) => link?.link?.slug && link?.link?.type)
    .slice(0, HEADER_NAV_MAX_ITEMS)
    .map((link) => {
      const type = link.link!.type as string
      const slug = link.link!.slug as string
      const href = linkResolver(type as LinkType, [slug], locale).href.trim()
      const logoUrl =
        type.toLowerCase() === 'organizationpage'
          ? orgLogoBySlug.get(slug)
          : undefined
      return {
        title: link.title ?? '',
        href,
        ...(logoUrl ? { logoUrl } : {}),
      }
    })

  return {
    label,
    title: label ? `${label} ${config.titleSuffix[locale]}` : '',
    items,
    seeAllHref: config.seeAllHref[locale],
    seeAllLabel: config.seeAllLabel[locale],
  }
}

// Builds the header-nav data shape from the Contentful grouped-menu and
// organizations queries. Returns `null` if the grouped menu is missing or
// has no child menus — callers fall back to the hardcoded mock in that
// case. Partial menus (some sections populated, others empty) are allowed:
// editors can fill sections incrementally and empty ones just render with
// no items.
export const buildHeaderNavData = (
  groupedMenu: GetGroupedMenuQuery['getGroupedMenu'] | null | undefined,
  organizations: Organization[] | null | undefined,
  locale: Locale,
): HeaderNavData | null => {
  const menus = (groupedMenu?.menus ?? []) as Menu[]
  if (menus.length === 0) return null

  const orgLogoBySlug = buildOrgLogoLookup(organizations ?? [])
  const data: Partial<HeaderNavData> = {}

  HEADER_NAV_KEYS.forEach((key, idx) => {
    const section = mapMenuToSection(menus[idx], key, locale, orgLogoBySlug)
    if (section) data[key] = section
  })

  // Only consider the build successful if every expected section is
  // present — mixing Contentful with mock per-section would be confusing
  // and hide missing-editor-content issues. Either all three or fallback.
  if (!data.organizations || !data.categories || !data.lifeEvents) {
    return null
  }

  return data as HeaderNavData
}
