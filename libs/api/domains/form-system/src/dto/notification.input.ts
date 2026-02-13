import { Field, InputType } from '@nestjs/graphql'
import { ScreenInput } from './screen.input'

@InputType('FormSystemNotificationInput')
export class NotificationInput {
  @Field(() => String, { nullable: false })
  applicationId!: string

  @Field(() => String, { nullable: false })
  slug!: string

  @Field(() => Boolean, { nullable: false })
  isTest!: boolean

  @Field(() => String, { nullable: false })
  command!: string

  @Field(() => ScreenInput, { nullable: true })
  screen?: ScreenInput
}

@InputType('FormSystemNotificationRequestInput')
export class NotificationRequestInput {
  @Field(() => String, { nullable: false })
  url!: string

  @Field(() => NotificationInput, { nullable: false })
  notificationDto!: NotificationInput
}
