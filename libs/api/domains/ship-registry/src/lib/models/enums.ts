import { registerEnumType } from '@nestjs/graphql'

export enum ShipRegistryCertificateStatus {
  Valid = 'VALID',
  Invalid = 'INVALID',
  ReinspectionNeeded = 'REINSPECTION_NEEDED',
  InInspectionWindow = 'IN_INSPECTION_WINDOW',
  Unknown = 'UNKNOWN',
}

registerEnumType(ShipRegistryCertificateStatus, {
  name: 'ShipRegistryCertificateStatus',
})
