import { Field, InputType } from '@nestjs/graphql'

@InputType('LicenseServiceV2VerifyPkPassInput')
export class VerifyPkPassInput {
  @Field()
  data!: string
}
