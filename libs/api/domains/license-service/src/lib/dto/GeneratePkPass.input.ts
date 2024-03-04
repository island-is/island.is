import { LicenseType } from '@island.is/shared/constants'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GeneratePkPassInput {
  @Field(() => String)
  licenseType!: LicenseType
}
