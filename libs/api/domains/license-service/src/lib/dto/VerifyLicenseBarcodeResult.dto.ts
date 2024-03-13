import {
  createUnionType,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { GenericLicenseType } from '../licenceService.type'
import { DriverLicenseData } from './licenses/DriverLicenseData.dto'

export enum VerifyLicenseError {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  // ERROR is for all errors except token expired, we do not want to expose the actual error message
  // to the clients. Instead, we will log the actual error.
  ERROR = 'ERROR',
}

registerEnumType(VerifyLicenseError, {
  name: 'VerifyLicenseError',
  description: 'Exhaustive list of verify license errors',
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

  @Field(() => VerifyLicenseError, {
    nullable: true,
    description: 'Verify result error',
  })
  error?: VerifyLicenseError

  @Field({ description: 'Is the verify valid?' })
  valid!: boolean
}
