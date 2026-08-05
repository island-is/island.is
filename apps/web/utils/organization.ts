import { Locale } from '@island.is/shared/types'

import { OrganizationPage, OrganizationTheme } from '../graphql/schema'
import { linkResolver, pathIsRoute } from '../hooks'
import { isLocale } from '../i18n/I18n'

// TODO: Perhaps add this functionality to the linkResolver
export const getOrganizationLink = (
  organization: { hasALandingPage?: boolean; slug: string; link?: string },
  locale: Locale,
) => {
  return organization?.hasALandingPage
    ? linkResolver('organizationpage', [organization.slug], locale).href
    : organization?.link
}

export const getOrganizationSidebarNavigationItems = (
  organizationPage: OrganizationPage,
  basePath: string,
) => {
  if (!organizationPage) return []
  return organizationPage.menuLinks.map(({ primaryLink, childrenLinks }) => ({
    title: primaryLink?.text ?? '',
    href: primaryLink?.url,
    active:
      primaryLink?.url === basePath ||
      childrenLinks.some((link) => link.url === basePath),
    items: childrenLinks.map(({ text, url }) => ({
      title: text,
      href: url,
      active: url === basePath,
    })),
  }))
}

export const getBackgroundStyle = (
  background?: Omit<OrganizationTheme, '__typename'> | null,
) => {
  if (!background) return ''
  return background.backgroundColor ?? ''
}

export const extractOrganizationSlugFromPathname = (
  pathname: string,
  locale: Locale,
) => {
  const isOrganizationPage = pathIsRoute(pathname, 'organizations', locale)
  if (!isOrganizationPage) {
    return ''
  }
  const segments = pathname.split('/').filter((x) => x)
  const localeSegment = isLocale(segments[0]) ? segments[0] : ''
  return (localeSegment ? segments[2] : segments[1]) ?? ''
}
