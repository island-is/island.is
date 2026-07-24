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
 * e.g. `https://island.is/umsoknir/<slug>/<id>`.
 * `clientLocationOrigin` is expected to already include the `/umsoknir` path
 * (as the CLIENT_LOCATION_ORIGIN environment variable does).
 */
export const getApplicationLink = (
  application: Pick<Application, 'id' | 'typeId'>,
  clientLocationOrigin: string,
): string =>
  `${clientLocationOrigin.replace(/\/$/, '')}/${getSlugFromType(
    application.typeId,
  )}/${application.id}`
