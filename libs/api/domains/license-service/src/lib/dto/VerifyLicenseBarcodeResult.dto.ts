import {
  createUnionType,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { GenericLicenseType } from '../licenceService.type'
import { DriverLicenseData } from './licenses/DriverLicenseData.dto'

export enum VerifyLicenseBarcodeError {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  // ERROR is for all errors except token expired, we do not want to expose the actual error message
  // to the clients. Instead, we will log the actual error.
  ERROR = 'ERROR',
}

registerEnumType(VerifyLicenseBarcodeError, {
  name: 'VerifyLicenseBarcodeError',
  description: 'Exhaustive list of verify license barcode errors',
})

export const VerifyLicenseBarcodeDataUnion = createUnionType({
  name: 'VerifyLicenseBarcodeDataUnion',
  types: () => [DriverLicenseData] as const,
  resolveType: (value) => {
    switch (value.type) {
      case GenericLicenseType.DriversLicense:
        return DriverLicenseData

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

  @Field(() => String, { nullable: true })
  licenseType?: GenericLicenseType

  @Field(() => VerifyLicenseBarcodeError, {
    nullable: true,
    description: 'Verify result error',
  })
  error?: VerifyLicenseBarcodeError

  @Field({ description: 'Is the verify valid?' })
  valid!: boolean
}
