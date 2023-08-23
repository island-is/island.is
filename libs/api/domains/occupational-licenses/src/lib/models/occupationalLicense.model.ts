import { Field, Int, ObjectType, createUnionType } from '@nestjs/graphql'
import { EducationalLicense } from './educationalLicense.model'
import { HealthDirectorateLicense } from './healthDirectorateLicense.model'

export const OccupationalLicense = createUnionType({
  name: 'OccupationalLicense',
  types: () => [HealthDirectorateLicense, EducationalLicense] as const,
  resolveType(value) {
    if ('legalEntityId' in value) {
      return HealthDirectorateLicense
    }
    if ('id' in value) {
      return EducationalLicense
    }

    return null
  },
})
