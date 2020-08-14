import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field((_1) => ID)
  ssn: string

  @Field()
  name: string

  @Field({ nullable: true })
  mobile?: string

  @Field()
  role: string
}
