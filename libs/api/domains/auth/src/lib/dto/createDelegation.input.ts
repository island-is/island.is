import { Field, InputType } from '@nestjs/graphql'

import { DelegationScopeInput } from './delegationScope.input'

@InputType('CreateAuthDelegationInput')
export class CreateDelegationInput {
  @Field(() => String)
  toNationalId!: string

  @Field(() => [DelegationScopeInput], { nullable: true })
  scopes?: DelegationScopeInput[]

  @Field(() => String, { nullable: true })
  domainName?: string
}
