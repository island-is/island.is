import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ApiScope } from './apiScope.model'

@ObjectType('AuthScopeCategory')
export class ScopeCategory {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String)
  slug!: string

  @Field(() => [ApiScope])
  scopes!: ApiScope[]

  constructor(partial: Partial<ScopeCategory>) {
    Object.assign(this, partial)
  }
}
