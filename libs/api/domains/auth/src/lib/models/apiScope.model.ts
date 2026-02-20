import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ApiScopeGroup } from './apiScopeGroup.model'
import { Domain } from './domain.model'

@ObjectType('AuthApiScope')
export class ApiScope {
  @Field(() => ID)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => ApiScopeGroup, { nullable: true })
  group?: ApiScopeGroup

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Domain, { nullable: true })
  domain?: Domain

  constructor(apiScope: ApiScope) {
    Object.assign(this, apiScope)
  }
}
