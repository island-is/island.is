import { Field, ID,ObjectType } from '@nestjs/graphql'

import { ScopeType } from '@island.is/clients/auth-public-api'

import { ApiScopeGroup } from './apiScopeGroup.model'

@ObjectType('AuthApiScope')
export class ApiScope {
  @Field(() => ID)
  name!: string

  @Field(() => ScopeType)
  type!: ScopeType

  @Field(() => String)
  displayName!: string

  @Field(() => ApiScopeGroup, { nullable: true })
  group?: typeof ApiScopeGroup

  @Field(() => String, { nullable: true })
  description?: string
}
