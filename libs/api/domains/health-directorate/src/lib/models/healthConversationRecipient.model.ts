import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import {
  HealthConversationDayTypeEnum,
  HealthConversationRecipientAvailabilityEnum,
  HealthConversationRecipientBlockedReasonEnum,
} from './enums'
import {
  HealthDirectorateHealthConversationNextOpening,
  HealthDirectorateHealthConversationOpeningHours,
  HealthDirectorateHealthConversationOpeningWindow,
} from './healthConversationOpeningHours.model'
import { HealthDirectorateHealthConversationType } from './healthConversationType.model'

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

  @Field({
    deprecationReason:
      'Use canCreateConversation and conversationBlockedReason instead.',
  })
  allowsMessaging!: boolean

  @Field({
    nullable: true,
    deprecationReason:
      'Resolves to the next open day when closed today. Use todaysWindow and nextOpensAt instead.',
  })
  messagingWindowOpen?: string

  @Field({
    nullable: true,
    deprecationReason:
      'Resolves to the next open day when closed today. Use todaysWindow and nextOpensAt instead.',
  })
  messagingWindowClose?: string

  @Field({ deprecationReason: 'Use availability instead.' })
  isCurrentlyWithinWindow!: boolean

  @Field({ deprecationReason: 'Use todaysWindow instead, absent when closed.' })
  isClosedToday!: boolean

  @Field(() => HealthConversationDayTypeEnum, {
    deprecationReason: 'Use todaysWindow instead, which is already resolved.',
  })
  dayType!: HealthConversationDayTypeEnum

  @Field(() => HealthConversationRecipientAvailabilityEnum, {
    description:
      'The one field to branch the UI on. As of the time of the request.',
  })
  availability!: HealthConversationRecipientAvailabilityEnum

  @Field(() => HealthDirectorateHealthConversationOpeningWindow, {
    nullable: true,
    description:
      'The hours the recipient keeps today. Absent when it is closed all of today.',
  })
  todaysWindow?: HealthDirectorateHealthConversationOpeningWindow

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description:
      'When the current window closes. Only set while availability is OPEN and the window is not all day, so a client can warn that closing is near.',
  })
  closesAt?: Date

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
