import {
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/types'
import { Organization } from '@island.is/shared/types'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'

export const getLogoFromContentfulSlug = (
  organizations: Organization[],
  institutionContentfulSlug?: string,
): string => {
  const institution = organizations.find(
    (x) => x.slug === institutionContentfulSlug,
  )
  return getOrganizationLogoUrl(
    institution?.title ?? 'stafraent-island',
    organizations,
  )
}

export const getSlugFromType = (type: ApplicationTypes) => {
  for (const [key, value] of Object.entries(ApplicationConfigurations)) {
    if (type === key) {
      return value.slug
    }
  }

  return undefined
}
