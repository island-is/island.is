import { Field, ObjectType } from '@nestjs/graphql'
import { LicenseResult } from './licenseResult.model'

@ObjectType('OccupationalLicensesLicenses')
export class LicenseCollection {
  @Field(() => [LicenseResult])
  licenses!: Array<typeof LicenseResult>
}
