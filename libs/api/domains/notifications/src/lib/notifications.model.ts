import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
  Int,
  InputType,
} from '@nestjs/graphql'
import {
  PageInfoDto,
  PaginatedResponse,
  PaginationInput,
} from '@island.is/nest/pagination'
import { RenderedNotificationDtoStatusEnum } from '@island.is/clients/user-notification'

registerEnumType(RenderedNotificationDtoStatusEnum, {
  name: 'NotificationStatus',
})

@ObjectType()
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

@ObjectType()
export class NotificationSender {
  @Field()
  name!: string

  @Field({ nullable: true })
  logo?: string
}

@ObjectType()
export class NotificationRecipient {
  @Field({ nullable: true })
  nationalId?: string
}

@ObjectType()
export class NotificationLink {
  @Field({ nullable: true })
  uri?: string
}

@ObjectType()
export class NotificationMessage {
  @Field()
  title!: string

  @Field()
  body!: string

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
