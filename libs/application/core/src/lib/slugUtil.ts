import {
  ApplicationConfigurations,
  ApplicationTypes,
} from '../types/ApplicationTypes'

export const getTypeFromSlug = (slug: string) =>
  Object.entries(ApplicationConfigurations).find(
    ([_, item]) => item.slug === slug,
  )?.[0] as ApplicationTypes | undefined
