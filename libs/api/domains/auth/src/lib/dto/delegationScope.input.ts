import { Field, InputType } from '@nestjs/graphql'

import { ScopeType } from '@island.is/clients/auth-public-api'

@InputType('AuthDelegationScopeInput')
export class DelegationScopeInput {
  @Field((_) => String)
  name!: string

  @Field((_) => ScopeType)
  type!: ScopeType

  @Field((_) => Date, { nullable: true })
  validTo?: Date
}
