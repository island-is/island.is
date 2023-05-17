import { Field, InputType } from '@nestjs/graphql'

@InputType('PatchAuthConsentInput')
export class PatchConsentInput {
  @Field(() => String)
  clientId!: string
  @Field(() => [String])
  consentedScopes!: string[]
  @Field(() => [String])
  rejectedScopes!: string[]
}
