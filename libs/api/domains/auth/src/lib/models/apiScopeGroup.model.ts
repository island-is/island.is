import { Field, ID,ObjectType } from '@nestjs/graphql'

@ObjectType('AuthApiScopeGroup')
export class ApiScopeGroup {
  @Field(() => ID)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String, { nullable: true })
  description?: string
}
