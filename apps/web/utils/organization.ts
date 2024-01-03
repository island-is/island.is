import { Locale } from 'locale'

import { OrganizationPage, OrganizationTheme } from '../graphql/schema'
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

export const getBackgroundStyle = (
  background?: Omit<OrganizationTheme, '__typename'> | null,
) => {
  if (!background) return ''
  if (
    background.useGradientColor &&
    background.gradientStartColor &&
    background.gradientEndColor
  )
    return `linear-gradient(99.09deg, ${background.gradientStartColor} 23.68%,
      ${background.gradientEndColor} 123.07%),
      linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%)`
  return background.backgroundColor ?? ''
}
