import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminScopeUser')
export class ScopeUser {
  @Field(() => String)
  nationalId!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string
}
