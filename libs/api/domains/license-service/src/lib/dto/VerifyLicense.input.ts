import { Field, InputType } from '@nestjs/graphql'

@InputType('VerifyLicenseInput')
export class VerifyLicenseInput {
  @Field(() => String)
  data!: string
}
