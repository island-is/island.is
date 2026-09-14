import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import {
  HealthConversationDayTypeEnum,
  HealthConversationRecipientBlockedReasonEnum,
} from './enums'
import { HealthDirectorateHealthConversationType } from './healthConversationType.model'

@ObjectType()
export class HealthDirectorateHealthConversationOpeningWindow {
  @Field({ description: 'HH:mm:ss, UTC.' })
  windowOpen!: string

  @Field({ description: 'HH:mm:ss, UTC.' })
  windowClose!: string
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

@ObjectType()
export class HealthDirectorateHealthConversationRecipient {
  @Field({ description: 'Hekla node ID of the recipient.' })
  nodeId!: string

  @Field(() => Int, {
    description: 'Hekla group ID of the recipient provider.',
  })
  groupId!: number

  @Field({
    nullable: true,
    description: 'Set when this recipient is one of the patient care teams',
  })
  treatmentId?: string

  @Field()
  name!: string

  @Field()
  allowsMessaging!: boolean

  @Field({
    nullable: true,
    description:
      'Effective window open time (HH:mm:ss, UTC). When isClosedToday is true this is the next open day’s time, not today’s.',
  })
  messagingWindowOpen?: string

  @Field({
    nullable: true,
    description:
      'Effective window close time (HH:mm:ss, UTC). When isClosedToday is true this is the next open day’s time, not today’s.',
  })
  messagingWindowClose?: string

  @Field()
  isCurrentlyWithinWindow!: boolean

  @Field()
  isClosedToday!: boolean

  @Field(() => HealthConversationDayTypeEnum, {
    description: 'Which kind of day today’s window was resolved for, in UTC.',
  })
  dayType!: HealthConversationDayTypeEnum

  @Field(() => HealthDirectorateHealthConversationNextOpening, {
    nullable: true,
    description:
      'Absent while inside the window, when allowsMessaging is false, or when no opening falls within the next two weeks.',
  })
  nextOpensAt?: HealthDirectorateHealthConversationNextOpening

  @Field(() => HealthDirectorateHealthConversationOpeningHours, {
    description:
      'A day type is absent when the recipient is closed on that kind of day.',
  })
  openingHours!: HealthDirectorateHealthConversationOpeningHours

  @Field(() => Int)
  patientReplyWindowDays!: number

  @Field(() => [HealthDirectorateHealthConversationType])
  allowedMessageTypes!: HealthDirectorateHealthConversationType[]

  @Field({
    description:
      'Whether the patient can start a new conversation with this recipient right now.',
  })
  canCreateConversation!: boolean

  @Field(() => HealthConversationRecipientBlockedReasonEnum, {
    nullable: true,
    description:
      'Why starting a conversation is blocked. Only set when canCreateConversation is false.',
  })
  conversationBlockedReason?: HealthConversationRecipientBlockedReasonEnum

  @Field({
    description:
      'Whether the patient can request a certificate from this recipient right now.',
  })
  canRequestCertificate!: boolean

  @Field(() => HealthConversationRecipientBlockedReasonEnum, {
    nullable: true,
    description:
      'Why requesting a certificate is blocked. Only set when canRequestCertificate is false.',
  })
  certificateBlockedReason?: HealthConversationRecipientBlockedReasonEnum
}
