import { m } from '../messages'

export const CATEGORY_TAG_SLUGS = [
  'grant-category-business',
  'grant-category-culture-and-arts',
  'grant-category-native',
  'grant-category-research',
  'grant-category-innovation',
  'grant-category-global',
  'grant-category-professional-education',
  'grant-category-education-and-teaching',
  'grant-category-youth-and-sports',
  'grant-category-energy-transition',
  'grant-category-environment',
] as const

export type CategorySlug = typeof CATEGORY_TAG_SLUGS[number]

export const mapTagToMessageId = (tagSlug: CategorySlug) => {
  switch (tagSlug) {
    case 'grant-category-business':
      return m.home.grantCategoryBusinessDescription
    case 'grant-category-culture-and-arts':
      return m.home.grantCategoryCultureAndArtsDescription
    case 'grant-category-native':
      return m.home.grantCategoryNativeDescription
    case 'grant-category-research':
      return m.home.grantCategoryResearchDescription
    case 'grant-category-innovation':
      return m.home.grantCategoryInnovationDescription
    case 'grant-category-global':
      return m.home.grantCategoryGlobalDescription
    case 'grant-category-professional-education':
      return m.home.grantCategoryProfessionalEducationDescription
    case 'grant-category-education-and-teaching':
      return m.home.grantCategoryEducationAndTeachingDescription
    case 'grant-category-youth-and-sports':
      return m.home.grantCategoryYouthAndSportsDescription
    case 'grant-category-energy-transition':
      return m.home.grantCategoryEnergyTransitionDescription
    case 'grant-category-environment':
      return m.home.grantCategoryEnvironmentDescription
  }
}
