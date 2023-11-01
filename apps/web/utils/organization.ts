import { Locale } from 'locale'
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
