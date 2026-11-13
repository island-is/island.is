import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { NotificationSender } from './notifications.model'

@ObjectType()
export class NotificationCategorySetting {
  @Field({ description: 'Key of the category, {senderId}-{category}' })
  key!: string

  @Field({ description: 'Slugified Icelandic category label' })
  category!: string

  @Field()
  label!: string

  @Field()
  blocked!: boolean
}

@ObjectType()
export class NotificationSenderSetting {
  @Field(() => NotificationSender)
  sender!: NotificationSender

  @Field(() => [NotificationCategorySetting])
  categories!: NotificationCategorySetting[]

  @Field({
    description: 'True if all notifications from the sender are blocked',
  })
  blocked!: boolean
}

@ObjectType()
export class NotificationSettings {
  @Field(() => [NotificationSenderSetting])
  senders!: NotificationSenderSetting[]

  @Field(() => Boolean, { nullable: true })
  onlyActionablePriorityNotifications?: boolean
}

@InputType()
export class NotificationCategoryInput {
  @Field()
  senderId!: string

  @Field()
  category!: string

  @Field()
  blocked!: boolean
}

@InputType()
export class NotificationSenderInput {
  @Field()
  senderId!: string

  @Field()
  blocked!: boolean
}

@InputType()
export class UpdateNotificationCategoriesInput {
  @Field(() => [NotificationCategoryInput], { nullable: true })
  categories?: NotificationCategoryInput[]

  @Field(() => [NotificationSenderInput], { nullable: true })
  senders?: NotificationSenderInput[]

  @Field(() => Boolean, { nullable: true })
  onlyActionablePriorityNotifications?: boolean
}
