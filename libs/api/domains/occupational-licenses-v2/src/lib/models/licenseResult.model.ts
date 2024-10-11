import { createUnionType } from '@nestjs/graphql'
import { LicenseError } from './licenseError.model'
import { License } from './license.model'

export const LicenseResult = createUnionType({
  name: 'OccupationalLicensesV2LicenseResult',
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
