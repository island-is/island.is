import { createUnionType } from '@nestjs/graphql'
import { LicenseError } from './GenericLicenseError.dto'
import { GenericUserLicense } from './GenericUserLicense.dto'

export const GenericLicenseResult = createUnionType({
  name: 'GenericLicenseResult',
  types: () => [GenericUserLicense, LicenseError] as const,
  resolveType(value) {
    if (value.type) {
      return LicenseError
    }

    return GenericUserLicense
  },
})
