import { Field, InputType } from '@nestjs/graphql'

import { ScopeType } from '@island.is/clients/auth-public-api'

@InputType('AuthDelegationScopeInput')
export class DelegationScopeInput {
  @Field(() => String)
  name!: string

  @Field(() => ScopeType)
  type!: ScopeType

  @Field(() => Date)
  validTo!: Date
}
