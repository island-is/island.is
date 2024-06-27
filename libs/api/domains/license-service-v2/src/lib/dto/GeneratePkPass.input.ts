import { Field, InputType } from '@nestjs/graphql'
import { GenericLicenseType } from '../licenceService.type'

@InputType('LicenseServiceV2GeneratePkPassInput')
export class GeneratePkPassInput {
  @Field(() => GenericLicenseType)
  licenseType!: GenericLicenseType
}
