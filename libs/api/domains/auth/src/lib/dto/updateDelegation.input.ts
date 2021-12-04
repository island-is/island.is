import { Field, InputType } from '@nestjs/graphql'

import { DelegationScopeInput } from './delegationScope.input'

@InputType('UpdateAuthDelegationInput')
export class UpdateDelegationInput {
  @Field(() => String)
  delegationId!: string

  @Field(() => [DelegationScopeInput])
  scopes?: DelegationScopeInput[]
}
