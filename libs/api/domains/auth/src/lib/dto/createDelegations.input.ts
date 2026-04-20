import { Field, InputType } from '@nestjs/graphql'

import { DelegationScopeWithDomainInput } from './delegationScope.input'

@InputType('CreateAuthDelegationsInput')
export class CreateDelegationsInput {
  @Field(() => [String])
  toNationalIds!: string[]

  @Field(() => [DelegationScopeWithDomainInput])
  scopes!: DelegationScopeWithDomainInput[]
}
