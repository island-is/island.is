import { Field, InputType } from '@nestjs/graphql'

import { DelegationScopeInput } from './delegationScope.input'

@InputType('CreateAuthDelegationInput')
export class CreateDelegationInput {
  @Field((_) => String)
  toNationalId!: string

  @Field((_) => [DelegationScopeInput], { nullable: true })
  scopes?: DelegationScopeInput[]
}
