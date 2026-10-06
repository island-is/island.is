import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { NotificationSender } from './notifications.model'

@ObjectType()
export class NotificationSenderSetting {
  @Field(() => NotificationSender)
  sender!: NotificationSender

  @Field()
  blocked!: boolean
}

@ObjectType()
export class NotificationSettings {
  @Field(() => [NotificationSenderSetting])
  senders!: NotificationSenderSetting[]
}

@InputType()
export class NotificationSenderInput {
  @Field()
  senderId!: string
}
