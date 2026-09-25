import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateHealthConversationOpeningWindow {
  @Field({ description: 'HH:mm:ss, UTC.' })
  windowOpen!: string

  @Field({ description: 'HH:mm:ss, UTC.' })
  windowClose!: string

  @Field({
    description:
      'True when the window spans the whole day, so there is no closing time to show or warn about.',
  })
  isAllDay!: boolean
}

@ObjectType()
export class HealthDirectorateHealthConversationOpeningHours {
  @Field(() => HealthDirectorateHealthConversationOpeningWindow, {
    nullable: true,
  })
  weekday?: HealthDirectorateHealthConversationOpeningWindow

  @Field(() => HealthDirectorateHealthConversationOpeningWindow, {
    nullable: true,
  })
  weekend?: HealthDirectorateHealthConversationOpeningWindow

  @Field(() => HealthDirectorateHealthConversationOpeningWindow, {
    nullable: true,
    description: 'Takes precedence over a weekend.',
  })
  holiday?: HealthDirectorateHealthConversationOpeningWindow
}

@ObjectType()
export class HealthDirectorateHealthConversationNextOpening {
  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field({ description: 'HH:mm:ss, UTC.' })
  windowOpen!: string

  @Field({ description: 'HH:mm:ss, UTC.' })
  windowClose!: string
}
