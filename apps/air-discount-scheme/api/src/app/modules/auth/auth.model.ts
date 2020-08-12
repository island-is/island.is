import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Auth {
  @Field()
  ssn: string

  @Field()
  name: string

  @Field()
  mobile: string

  @Field()
  role: string
}
