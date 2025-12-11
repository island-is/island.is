import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  Int,
  InputType,
} from '@nestjs/graphql'
import { PaginatedResponse, PaginationInput } from '@island.is/nest/pagination'

@ObjectType()
export class NotificationMetadata {
  @Field(() => GraphQLISODateTime)
  sent!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  updated?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  created?: Date

  @Field({ nullable: true })
  read?: boolean

  @Field({ nullable: true })
  seen?: boolean
}

@ObjectType()
export class NotificationSender {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  logoUrl?: string
}

@ObjectType()
export class NotificationRecipient {
  @Field({ nullable: true })
  nationalId?: string
}

@ObjectType()
export class NotificationLink {
  @Field({ nullable: true })
  url?: string
}

@ObjectType()
export class NotificationMessage {
  @Field()
  title!: string

  @Field()
  body!: string

  @Field({ nullable: true })
  dataCopy?: string

  @Field({
    description:
      'Displays the {dataCopy} by default, will display {body} as fallback',
  })
  displayBody!: string

  @Field(() => NotificationLink)
  link!: NotificationLink
}

@ObjectType()
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

@ObjectType()
export class AdminNotification {
  @Field(() => Int)
  id!: number

  @Field(() => ID)
  notificationId!: string

  @Field(() => NotificationSender)
  sender!: NotificationSender

  @Field()
  scope!: string

  @Field(() => GraphQLISODateTime)
  sent!: Date
}

@ObjectType()
export class ActorNotification {
  @Field(() => Int)
  id!: number

  @Field()
  messageId!: string

  @Field()
  rootMessageId!: string

  @Field(() => Int)
  userNotificationId!: number

  @Field(() => NotificationRecipient)
  recipient!: NotificationRecipient

  @Field(() => NotificationRecipient)
  onBehalfOfNationalId!: NotificationRecipient

  @Field()
  scope!: string

  @Field(() => GraphQLISODateTime)
  created!: Date
}

@InputType()
export class NotificationsInput extends PaginationInput() {}

@ObjectType('Notifications')
export class NotificationsResponse extends PaginatedResponse(Notification) {
  @Field(() => Int, { nullable: true })
  unreadCount?: number

  @Field(() => Int, { nullable: true })
  unseenCount?: number
}

@ObjectType('AdminNotifications')
export class AdminNotificationsResponse extends PaginatedResponse(
  AdminNotification,
) {}

@ObjectType('ActorNotifications')
export class ActorNotificationsResponse extends PaginatedResponse(
  ActorNotification,
) {}

@ObjectType()
export class NotificationResponse {
  @Field(() => Notification)
  data!: Notification
}

@InputType()
export class MarkNotificationReadInput {
  @Field()
  notificationId!: string
}

@ObjectType()
export class MarkNotificationReadResponse {
  @Field(() => Notification)
  data!: Notification
}

@ObjectType()
export class NotificationsMarkAllAsSeenResponse {
  @Field()
  success!: boolean
}

@ObjectType()
export class NotificationsMarkAllAsReadResponse {
  @Field()
  success!: boolean
}

@ObjectType()
export class NotificationsUnreadCount {
  @Field(() => Int)
  unreadCount!: number
}

@ObjectType()
export class NotificationsUnseenCount {
  @Field(() => Int)
  unseenCount!: number
}
