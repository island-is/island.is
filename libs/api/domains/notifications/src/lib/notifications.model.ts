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

@InputType()
export class NotificationsInput extends PaginationInput() {}

@ObjectType('Notifications')
export class NotificationsResponse extends PaginatedResponse(Notification) {
  @Field(() => Int, { nullable: true })
  unreadCount?: number

  @Field(() => Int, { nullable: true })
  unseenCount?: number
}

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
