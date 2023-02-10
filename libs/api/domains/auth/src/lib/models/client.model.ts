import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthClient')
export class Client {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string
}
