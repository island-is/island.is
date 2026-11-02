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
}

@ObjectType()
export class NotificationSettings {
  @Field(() => [NotificationSenderSetting])
  senders!: NotificationSenderSetting[]
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
export class UpdateNotificationCategoriesInput {
  @Field(() => [NotificationCategoryInput])
  categories!: NotificationCategoryInput[]
}
