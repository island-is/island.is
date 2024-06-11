import { Field, ObjectType } from '@nestjs/graphql'
import { GenericLicenseResult } from './GenericLicenseResult.dto'

@ObjectType('GenericLicensesCollection')
export class LicenseCollection {
  @Field(() => [GenericLicenseResult])
  licenses!: Array<typeof GenericLicenseResult>

  @Field(() => [GenericLicenseResult])
  childLicenses!: Array<typeof GenericLicenseResult>
}
