import {
  ApplicationConfigurations,
  ApplicationTypes,
} from '../types/ApplicationTypes'

export const getTypeFromSlug = (slug: string) =>
  Object.entries(ApplicationConfigurations).find(
    ([_, item]) => item.slug === slug,
  )?.[0] as ApplicationTypes | undefined

export const getSlugFromType = (type: ApplicationTypes) =>
  Object.entries(ApplicationConfigurations).find(([id]) => id === type)?.[0] as
    | string
    | undefined
