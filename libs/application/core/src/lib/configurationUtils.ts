import {
  Application,
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/types'

export const getTypeFromSlug = (slug?: string) => {
  for (const [key, value] of Object.entries(ApplicationConfigurations)) {
    if (value.slug === slug) {
      return key as ApplicationTypes
    }
  }

  return undefined
}

export const getSlugFromType = (type: ApplicationTypes) => {
  for (const [key, value] of Object.entries(ApplicationConfigurations)) {
    if (type === key) {
      return value.slug
    }
  }

  return undefined
}

/**
 * Builds the citizen-facing link to an application,
 * e.g. `https://island.is/umsoknir/<slug>/<id>`, or
 * `https://island.is/umsoknir/sdf/<slug>/<id>` for a server-driven application.
 * `clientLocationOrigin` is expected to already include the `/umsoknir` path
 * (as the CLIENT_LOCATION_ORIGIN environment variable does).
 */
export const getApplicationLink = (
  application: Pick<Application, 'id' | 'typeId'>,
  clientLocationOrigin: string,
): string => {
  const slug = getSlugFromType(application.typeId)

  if (!slug) {
    throw new Error(
      `getApplicationLink: no slug configured for application type "${application.typeId}"`,
    )
  }

  const sdfSegment = ApplicationConfigurations[application.typeId]?.useSdf
    ? '/sdf'
    : ''

  return `${clientLocationOrigin.replace(/\/$/, '')}${sdfSegment}/${slug}/${
    application.id
  }`
}
