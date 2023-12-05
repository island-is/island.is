import {
  Field,
  GraphQLISODateTime,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { PageInfoDto } from '@island.is/nest/pagination'

// TODO move to/import from client
export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

registerEnumType(NotificationStatus, { name: 'NotificationStatus' })

@ObjectType('NotificationMetadata')
export class NotificationMetadata {
  @Field(() => GraphQLISODateTime)
  sent!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  read?: Date

  @Field(() => NotificationStatus)
  status!: NotificationStatus
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
  @Field()
  nationalId!: string
}

@ObjectType('NotificationLink')
export class NotificationLink {
  @Field()
  uri!: string
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

@ObjectType('MessageCounts')
export class MessageCounts {
  @Field()
  totalCount!: number

  @Field()
  unreadCount!: number
}

@InputType('NotificationsInput')
export class NotificationsInput {
  @Field({ nullable: true })
  first?: number

  @Field({
    nullable: true,
  })
  after?: string
}

@ObjectType('Notifications')
export class NotificationsResponse {
  @Field(() => [Notification])
  data!: Notification[]

  @Field(() => MessageCounts)
  messageCounts!: MessageCounts

  @Field()
  totalCount!: number

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
