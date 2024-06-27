import { Field, ObjectType } from '@nestjs/graphql'
import { LicenseError } from './GenericLicenseError.dto'
import { GenericUserLicense } from './GenericUserLicense.dto'

@ObjectType('LicenseServiceV2GenericLicensesCollection')
export class LicenseCollection {
  @Field(() => [GenericUserLicense], { nullable: true })
  licenses!: Array<GenericUserLicense>

  @Field(() => [LicenseError], { nullable: true })
  errors?: Array<LicenseError>
}
