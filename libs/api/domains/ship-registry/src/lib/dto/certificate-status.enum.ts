import { registerEnumType } from '@nestjs/graphql'

// TODO: Confirm exact status string values from ship registry API provider
// and update mapCertificateStatus() in mapper.ts accordingly
export enum ShipRegistryCertificateStatus {
  Valid = 'VALID',
  Expired = 'EXPIRED',
  Unknown = 'UNKNOWN',
}

registerEnumType(ShipRegistryCertificateStatus, {
  name: 'ShipRegistryCertificateStatus',
})
