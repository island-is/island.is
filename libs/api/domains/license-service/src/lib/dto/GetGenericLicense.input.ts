import { LicenseType } from '@island.is/shared/constants'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetGenericLicenseInput {
  @Field(() => String)
  licenseType!: LicenseType

  @Field(() => String, { nullable: true })
  licenseId?: string
}
