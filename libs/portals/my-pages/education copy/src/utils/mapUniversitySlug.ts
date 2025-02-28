import { UniversityCareersUniversityId } from '@island.is/api/schema'
import { OrganizationSlugType } from '@island.is/shared/constants'

export type UniversitySlug =
  | 'lbhi'
  | 'holar'
  | 'hi'
  | 'unak'
  | 'bifrost'
  | 'lhi'

const isUniversitySlug = (slug: string): slug is UniversitySlug => {
  return (
    slug === 'lbhi' ||
    slug === 'holar' ||
    slug === 'hi' ||
    slug === 'unak' ||
    slug === 'bifrost' ||
    slug === 'lhi'
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
    case UniversityCareersUniversityId.ICELAND_UNIVERSITY_OF_THE_ARTS:
      return 'lhi'
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
    case 'lhi':
      return UniversityCareersUniversityId.ICELAND_UNIVERSITY_OF_THE_ARTS
  }
}

export const mapSlugToContentfulSlug = (
  slug: string,
): OrganizationSlugType | null => {
  if (!isUniversitySlug(slug)) {
    return null
  }

  switch (slug) {
    case 'lbhi':
      return 'landbunadarhaskoli-islands'
    case 'holar':
      return 'holaskoli-haskolinn-a-holum'
    case 'hi':
      return 'haskoli-islands'
    case 'unak':
      return 'haskolinn-a-akureyri'
    case 'bifrost':
      return 'bifrost'
    case 'lhi':
      return 'lhi'
  }
}
