import { Field, InputType } from '@nestjs/graphql'
import { GenericLicenseType } from '../licenceService.type'

@InputType()
export class GeneratePkPassInput {
  @Field(() => String)
  licenseType!: GenericLicenseType
}
