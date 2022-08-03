import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class MailchimpSubscribeResponse {
  @Field(() => Boolean)
  subscribed!: boolean
}
