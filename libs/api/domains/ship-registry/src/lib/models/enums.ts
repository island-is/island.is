import { registerEnumType } from '@nestjs/graphql'

export enum ShipRegistryCertificateStatus {
  Valid = 'valid',
  Invalid = 'invalid',
  ReinspectionNeeded = 'reinspectionNeeded',
  InInspectionWindow = 'inInspectionWindow',
  Unknown = 'unknown',
}

registerEnumType(ShipRegistryCertificateStatus, {
  name: 'ShipRegistryCertificateStatus',
})
