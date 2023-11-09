import { Locale } from 'locale'

import { OrganizationPage } from '../graphql/schema'
import { linkResolver } from '../hooks'

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
