import { registerEnumType } from '@nestjs/graphql'

export enum StatusV2 {
  VALID = 'valid',
  INVALID = 'invalid',
  LIMITED = 'limited',
  IN_PROGRESS = 'in-progress',
  REVOKED = 'revoked',
  WAIVED = 'waived',
  UNKNOWN = 'unknown',
}

registerEnumType(StatusV2, {
  name: 'OccupationalLicenseStatusV2',
})
