import { Field, ObjectType } from '@nestjs/graphql'
import { LicenseType } from './licenseType.model'

@ObjectType('OccupationalLicensesError')
export class LicenseError {
  @Field(() => LicenseType)
  type!: LicenseType

  @Field({ nullable: true, description: 'The error, raw' })
  error?: string
}
