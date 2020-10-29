import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ConfirmResponse {
  @Field(() => String)
  message!: string

  @Field(() => Boolean)
  confirmed!: boolean
}

@ObjectType()
export class Response {
  @Field(() => Boolean)
  created!: true
}
