import {
  createUnionType,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { GenericLicenseType } from '../licenceService.type'
import { DriverLicenseData } from './licenses/DriverLicenseData.dto'
import { FirearmLicenseData } from './licenses/FirearmLicenseData.dto'
import { GeneralLicenseData } from './licenses/GeneralLicenseData.dto'
import { HuntingLicenseData } from './licenses/HuntingLicenseData.dto'

export enum VerifyLicenseBarcodeError {
  // When the license barcode is expired, e.g. token expired or the JSON string data includes an expired expiration date field value
  EXPIRED = 'EXPIRED',
  // ERROR is for all errors except token expired, we do not want to expose the actual error message
  // to the clients. Instead, we will log the actual error.
  ERROR = 'ERROR',
}

registerEnumType(VerifyLicenseBarcodeError, {
  name: 'VerifyLicenseBarcodeError',
  description: 'Exhaustive list of verify license barcode errors',
})

export enum VerifyLicenseBarcodeType {
  V2 = 'V2',
  PK_PASS = 'PK_PASS',
  UNKNOWN = 'UNKNOWN',
}

registerEnumType(VerifyLicenseBarcodeType, {
  name: 'VerifyLicenseBarcodeType',
  description: 'Exhaustive list of verify license barcode types',
})

export const VerifyLicenseBarcodeDataUnion = createUnionType({
  name: 'VerifyLicenseBarcodeDataUnion',
  types: () =>
    [
      DriverLicenseData,
      FirearmLicenseData,
      GeneralLicenseData,
      HuntingLicenseData,
    ] as const,
  resolveType: (value) => {
    switch (value.type) {
      case GenericLicenseType.DriversLicense:
        return DriverLicenseData
      case GenericLicenseType.FirearmLicense:
        return FirearmLicenseData
      case GenericLicenseType.HuntingLicense:
        return HuntingLicenseData
      case GenericLicenseType.AdrLicense:
      case GenericLicenseType.MachineLicense:
      case GenericLicenseType.DisabilityLicense:
        return GeneralLicenseData
      default:
        return null
    }
  },
})

@ObjectType('VerifyLicenseBarcodeResult')
export class VerifyLicenseBarcodeResult {
  @Field(() => VerifyLicenseBarcodeDataUnion, {
    nullable: true,
    description: 'Optional data related to the verify verification',
  })
  data?: typeof VerifyLicenseBarcodeDataUnion | null

  @Field(() => GenericLicenseType, { nullable: true })
  licenseType?: GenericLicenseType

  @Field(() => VerifyLicenseBarcodeError, {
    nullable: true,
    description: 'Verify result error',
  })
  error?: VerifyLicenseBarcodeError

  @Field({ description: 'Is the verify valid?' })
  valid!: boolean

  @Field(() => VerifyLicenseBarcodeType, {
    description: 'Verify license barcode type',
  })
  barcodeType!: VerifyLicenseBarcodeType
}
