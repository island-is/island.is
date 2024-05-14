import { Field, ObjectType } from '@nestjs/graphql'
import { LicenseType } from './licenseType.model'

@ObjectType('OccupationalLicensesV2Error')
export class LicenseError {
  @Field(() => LicenseType)
  type!: LicenseType

  @Field({ nullable: true, description: 'The error, raw' })
  error?: string
}
