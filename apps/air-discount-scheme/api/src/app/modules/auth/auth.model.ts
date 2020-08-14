import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(type => ID, { nullable: true })
  ssn?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  mobile?: string

  @Field({ nullable: true })
  role?: string
}
