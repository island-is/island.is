import {
  createUnionType,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { DefaultLicenseData } from './licenses/DefaultLicenseData.dto'
import { GenericLicenseType } from '../licenceService.type'
import { DriverLicenseData } from './licenses/DriverLicenseData.dto'

export enum LicenseVerifyError {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  ERROR = 'ERROR',
}

registerEnumType(LicenseVerifyError, {
  name: 'LicenseVerifyError',
  description: 'Exhaustive list of verify license errors',
})

export const LicenseVerifyResultUnion = createUnionType({
  name: 'LicenseVerifyResultUnion',
  types: () => [DriverLicenseData, DefaultLicenseData] as const,
  resolveType: (value) => {
    switch (value.type) {
      case GenericLicenseType.DriversLicense:
        return DriverLicenseData

      default:
        return DefaultLicenseData
    }
  },
})

@ObjectType('LicenseVerifyResult')
export class LicenseVerifyResult {
  @Field(() => LicenseVerifyResultUnion, {
    nullable: true,
    description: 'Optional data related to the verify verification',
  })
  data?: typeof LicenseVerifyResultUnion

  @Field(() => String, { nullable: true })
  licenseType?: GenericLicenseType

  @Field(() => LicenseVerifyError, {
    nullable: true,
    description: 'Verify result error, if any',
  })
  error?: LicenseVerifyError

  @Field({ description: 'Is the verify valid?' })
  valid!: boolean
}
