import { registerEnumType } from '@nestjs/graphql'

export enum DrivingLicenseDeprivationStatus {
  LOST = 'LOST',
  EXPIRED = 'EXPIRED',
  LOSTANDEXPIRED = 'LOSTANDEXPIRED',
}

registerEnumType(DrivingLicenseDeprivationStatus, {
  name: 'DrivingLicenseDeprivationStatus',
})
