import { UniversityCareersUniversityId } from '@island.is/api/schema'

export type UniversitySlug = 'lbhi' | 'holar' | 'hi' | 'unak' | 'bifrost'

const isUniversitySlug = (slug: string): slug is UniversitySlug => {
  return (
    slug === 'lbhi' ||
    slug === 'holar' ||
    slug === 'hi' ||
    slug === 'unak' ||
    slug === 'bifrost'
  )
}

export const mapUniversityToSlug = (
  university: UniversityCareersUniversityId,
): UniversitySlug => {
  switch (university) {
    case UniversityCareersUniversityId.AGRICULTURAL_UNIVERSITY_OF_ICELAND:
      return 'lbhi'
    case UniversityCareersUniversityId.HOLAR_UNIVERSITY:
      return 'holar'
    case UniversityCareersUniversityId.UNIVERSITY_OF_ICELAND:
      return 'hi'
    case UniversityCareersUniversityId.UNIVERSITY_OF_AKUREYRI:
      return 'unak'
    case UniversityCareersUniversityId.BIFROST_UNIVERSITY:
      return 'bifrost'
  }
}

export const mapSlugToUniversity = (
  slug: string,
): UniversityCareersUniversityId | null => {
  if (!isUniversitySlug(slug)) {
    return null
  }

  switch (slug) {
    case 'lbhi':
      return UniversityCareersUniversityId.AGRICULTURAL_UNIVERSITY_OF_ICELAND
    case 'holar':
      return UniversityCareersUniversityId.HOLAR_UNIVERSITY
    case 'hi':
      return UniversityCareersUniversityId.UNIVERSITY_OF_ICELAND
    case 'unak':
      return UniversityCareersUniversityId.UNIVERSITY_OF_AKUREYRI
    case 'bifrost':
      return UniversityCareersUniversityId.BIFROST_UNIVERSITY
  }
}
