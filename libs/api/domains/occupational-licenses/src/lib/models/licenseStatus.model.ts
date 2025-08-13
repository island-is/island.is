import { registerEnumType } from '@nestjs/graphql'

export enum Status {
  VALID = 'valid',
  INVALID = 'invalid',
  LIMITED = 'limited',
  IN_PROGRESS = 'in-progress',
  REVOKED = 'revoked',
  WAIVED = 'waived',
  UNKNOWN = 'unknown',
}

registerEnumType(Status, {
  name: 'OccupationalLicenseStatus',
})
