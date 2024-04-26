import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SendNotificationResponse {
  @Field(() => Boolean)
  notificationSent!: boolean
}
