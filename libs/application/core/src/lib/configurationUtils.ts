import {
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
