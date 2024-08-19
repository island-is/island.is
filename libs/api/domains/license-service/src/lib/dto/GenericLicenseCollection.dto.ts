import { Field, ObjectType } from '@nestjs/graphql'
import { GenericLicenseError } from './GenericLicenseError.dto'
import { GenericUserLicense } from './GenericUserLicense.dto'

@ObjectType('GenericLicenseCollection')
export class LicenseCollection {
  @Field(() => [GenericUserLicense], { nullable: true })
  licenses!: Array<GenericUserLicense>

  @Field(() => [GenericLicenseError], { nullable: true })
  errors?: Array<GenericLicenseError>
}
