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

export class NotificationSender {
  @Field()
  name!: string

  @Field({ nullable: true })
  logo?: string
}

export class NotificationRecipient {
  @Field({ nullable: true })
  nationalId?: string
}

export class NotificationLink {
  @Field({ nullable: true })
  uri?: string
}

export class NotificationMessage {
  @Field()
  title!: string

  @Field()
  body!: string

  @Field(() => NotificationLink)
  link!: NotificationLink
}

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

export class NotificationMessageCounts {
  @Field(() => Int, { nullable: true })
  totalCount?: number

  @Field(() => Int, { nullable: true })
  unreadCount?: number
}

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

export class NotificationResponse {
  @Field(() => Notification)
  data!: Notification
}

export class MarkNotificationReadInput {
  @Field()
  notificationId!: string
}

export class MarkNotificationReadResponse {
  @Field(() => Notification)
  data!: Notification
}
