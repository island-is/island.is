import { Field, InputType } from '@nestjs/graphql'
import { GenericLicenseType } from '../licenceService.type'

@InputType()
export class GetGenericLicenseInput {
  @Field(() => String)
  licenseType!: GenericLicenseType

  @Field({ nullable: true })
  licenseId?: string
}
