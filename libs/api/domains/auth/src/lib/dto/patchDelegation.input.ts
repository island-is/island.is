import { Field, InputType } from '@nestjs/graphql'

import { DelegationScopeInput } from './delegationScope.input'

@InputType('PatchAuthDelegationInput')
export class PatchDelegationInput {
  @Field(() => String)
  delegationId!: string

  @Field(() => [DelegationScopeInput], { nullable: true })
  updateScopes?: DelegationScopeInput[]

  @Field(() => [String], { nullable: true })
  deleteScopes?: string[]
}
