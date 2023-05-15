import { Field, InputType } from '@nestjs/graphql'

@InputType('UpdateAuthConsentInput')
export class UpdateConsentInput {
  @Field(() => String)
  clientId!: string
  @Field(() => [String])
  consentedScopes!: string[]
  @Field(() => [String])
  rejectedScopes!: string[]
}
