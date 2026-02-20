import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ApiScope } from './apiScope.model'

@ObjectType('AuthScopeTag')
export class ScopeTag {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => [ApiScope])
  scopes!: ApiScope[]

  constructor(partial: Partial<ScopeTag>) {
    Object.assign(this, partial)
  }
}
