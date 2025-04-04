import { createUnionType } from '@nestjs/graphql'
import { LicenseError } from './licenseError.model'
import { License } from './license.model'

export const LicenseResult = createUnionType({
  name: 'OccupationalLicensesLicenseResult',
  types: () => [License, LicenseError] as const,
  resolveType(value) {
    if (value.licenseId) {
      return License
    }

    if (value.type) {
      return LicenseError
    }

    return null
  },
})
