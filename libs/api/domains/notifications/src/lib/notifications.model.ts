import {
  Field,
  GraphQLISODateTime,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
  Int,
} from '@nestjs/graphql'
import { PageInfoDto } from '@island.is/nest/pagination'
import { RenderedNotificationDtoStatusEnum } from '@island.is/clients/user-notification'

registerEnumType(RenderedNotificationDtoStatusEnum, {
  name: 'NotificationStatus',
})

@ObjectType('NotificationMetadata')
export class NotificationMetadata {
  @Field(() => GraphQLISODateTime)
  sent!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  updated?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  created?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  read?: Date

  @Field(() => RenderedNotificationDtoStatusEnum)
  status!: RenderedNotificationDtoStatusEnum
}

@ObjectType('NotificationSender')
export class NotificationSender {
  @Field()
  name!: string

  @Field({ nullable: true })
  logo?: string
}

@ObjectType('NoticiationRecipient')
export class NotificationRecipient {
  @Field({ nullable: true })
  nationalId?: string
}

@ObjectType('NotificationLink')
export class NotificationLink {
  @Field({ nullable: true })
  uri?: string
}

@ObjectType('NotificationMessage')
export class NotificationMessage {
  @Field()
  title!: string

  @Field()
  body!: string

  @Field(() => NotificationLink)
  link!: NotificationLink
}

@ObjectType('Notification')
export class Notification {
  @Field(() => Int)
  id!: number

  @Field(() => ID)
  notificationId!: string

  @Field(() => NotificationMetadata)
  metadata!: NotificationMetadata

  @Field(() => NotificationSender)
  sender!: NotificationSender

  @Field(() => NotificationRecipient)
  recipient!: NotificationRecipient

  @Field(() => NotificationMessage)
  message!: NotificationMessage
}

@ObjectType('NotificationMessageCounts')
export class NotificationMessageCounts {
  @Field(() => Int, { nullable: true })
  totalCount?: number

  @Field(() => Int, { nullable: true })
  unreadCount?: number
}

@InputType('NotificationsInput')
export class NotificationsInput {
  @Field(() => Int, { nullable: true })
  first?: number

  @Field(() => Int, {
    nullable: true,
  })
  after?: number

  @Field(() => Int, {
    nullable: true,
    defaultValue: 10,
  })
  limit?: number
}

@ObjectType('Notifications')
export class NotificationsResponse {
  @Field(() => [Notification])
  data!: Notification[]

  @Field(() => NotificationMessageCounts)
  messageCounts!: NotificationMessageCounts

  @Field(() => PageInfoDto)
  pageInfo!: PageInfoDto
}

@ObjectType('NotificationResponse')
export class NotificationResponse {
  @Field(() => Notification)
  data!: Notification
}

@InputType('MarkNotificationReadInput')
export class MarkNotificationReadInput {
  @Field()
  notificationId!: string
}

@ObjectType('MarkNotificationReadResponse')
export class MarkNotificationReadResponse {
  @Field(() => Notification)
  data!: Notification
}
