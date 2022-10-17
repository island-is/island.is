import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ApiScope } from './apiScope.model'

@ObjectType('AuthApiScopeGroup')
export class ApiScopeGroup {
  @Field(() => ID)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => [ApiScope], { nullable: true })
  children?: ApiScope[]

  constructor(apiScopeGroup: ApiScopeGroup) {
    Object.assign(this, apiScopeGroup)
  }
}
