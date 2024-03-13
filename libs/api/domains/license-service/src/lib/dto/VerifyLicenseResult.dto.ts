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
  ERROR = 'ERROR',
}

registerEnumType(VerifyLicenseError, {
  name: 'VerifyLicenseError',
  description: 'Exhaustive list of verify license errors',
})

export const VerifyLicenseResultUnion = createUnionType({
  name: 'VerifyLicenseResultUnion',
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

@ObjectType('VerifyLicenseResult')
export class VerifyLicenseResult {
  @Field(() => VerifyLicenseResultUnion, {
    nullable: true,
    description: 'Optional data related to the verify verification',
  })
  data?: typeof VerifyLicenseResultUnion | null

  @Field(() => String, { nullable: true })
  licenseType?: GenericLicenseType

  @Field(() => VerifyLicenseError, {
    nullable: true,
    description: 'Verify result error, if any',
  })
  error?: VerifyLicenseError

  @Field({ description: 'Is the verify valid?' })
  valid!: boolean
}
