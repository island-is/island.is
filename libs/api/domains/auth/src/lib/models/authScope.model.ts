import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class AuthScope {
  @Field(() => ID)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String)
  groupName!: string

  @Field(() => String)
  description!: string
}
