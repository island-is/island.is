import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EmailSignupResponse {
  @Field(() => Boolean)
  subscribed!: boolean
}
