import { Field, InputType } from '@nestjs/graphql'

import { DelegationScopeInput } from './delegationScope.input'

@InputType('UpdateAuthDelegationInput')
export class UpdateDelegationInput {
  @Field((_) => String)
  toNationalId!: string

  @Field((_) => String, { nullable: true })
  name?: string

  @Field((_) => [DelegationScopeInput])
  scopes?: DelegationScopeInput[]
}
