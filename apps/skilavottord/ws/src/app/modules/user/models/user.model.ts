import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field((_1) => ID)
  nationalId: string

  @Field()
  name: string

  @Field({ nullable: true })
  mobile?: string
}
