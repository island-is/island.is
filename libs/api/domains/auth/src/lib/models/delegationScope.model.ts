import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { ScopeType } from '@island.is/clients/auth-public-api'

registerEnumType(ScopeType, { name: 'AuthDelegationScopeType' })

@ObjectType('AuthDelegationScope')
export class DelegationScope {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field((_) => ScopeType)
  type!: ScopeType

  @Field(() => String)
  displayName!: string

  @Field(() => Date, { nullable: true })
  validTo?: Date
}
