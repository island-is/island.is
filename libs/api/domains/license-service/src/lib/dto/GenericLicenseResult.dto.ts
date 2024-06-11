import { createUnionType } from '@nestjs/graphql'
import { GenericLicense } from './GenericLicense.dto'
import { LicenseError } from './GenericLicenseError.dto'

export const GenericLicenseResult = createUnionType({
  name: 'GenericLicenseResult',
  types: () => [GenericLicense, LicenseError] as const,
  resolveType(value) {
    if (value.status) {
      return GenericLicense
    }

    if (value.type) {
      return LicenseError
    }

    return null
  },
})
