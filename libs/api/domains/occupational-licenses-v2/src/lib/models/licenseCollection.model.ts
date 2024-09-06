import { Field, ObjectType } from '@nestjs/graphql'
import { LicenseResult } from './licenseResult.model'

@ObjectType('OccupationalLicensesV2Licenses')
export class LicenseCollection {
  @Field(() => [LicenseResult])
  licenses!: Array<typeof LicenseResult>
}
