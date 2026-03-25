import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminScopeTag')
export class ScopeTag {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string
}
