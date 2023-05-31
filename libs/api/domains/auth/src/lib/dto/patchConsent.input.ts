import { Field, InputType } from '@nestjs/graphql'

@InputType('PatchAuthConsentInput')
export class PatchConsentInput {
  @Field(() => String)
  clientId!: string
  @Field(() => String, { nullable: true })
  consentedScope?: string
  @Field(() => String, { nullable: true })
  rejectedScope?: string
}
