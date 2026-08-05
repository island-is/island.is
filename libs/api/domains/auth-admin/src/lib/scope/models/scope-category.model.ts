import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminScopeCategory')
export class ScopeCategory {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field({ nullable: true })
  description?: string
}
