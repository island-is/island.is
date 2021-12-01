import { Field, InputType } from '@nestjs/graphql'

import { DelegationScopeInput } from './delegationScope.input'

@InputType('UpdateAuthDelegationInput')
export class UpdateDelegationInput {
  @Field((_) => String)
  delegationId!: string

  @Field((_) => [DelegationScopeInput])
  scopes?: DelegationScopeInput[]
}
