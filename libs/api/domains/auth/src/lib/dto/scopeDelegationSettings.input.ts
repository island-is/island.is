import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthScopeDelegationSettingsInput')
export class ScopeDelegationSettingsInput {
  @Field(() => [String])
  scopes!: string[]
}
