import { Field, ObjectType } from '@nestjs/graphql'

import { CacheField } from '@island.is/nest/graphql'

@ObjectType('AuthScopeRequestable')
export class ScopeRequestable {
  @Field(() => Boolean)
  individual!: boolean

  @Field(() => Boolean)
  company!: boolean
}

@ObjectType('AuthScopeDelegationSettings')
export class ScopeDelegationSettings {
  @Field(() => String)
  name!: string

  @Field(() => String)
  domainName!: string

  @Field(() => [String])
  delegationTypes!: string[]

  @CacheField(() => ScopeRequestable)
  requestable!: ScopeRequestable
}
