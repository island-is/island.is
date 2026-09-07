import { Field, Int, ObjectType } from '@nestjs/graphql'
import { HealthConversationRecipientBlockedReasonEnum } from './enums'
import { HealthDirectorateHealthConversationType } from './healthConversationType.model'

@ObjectType()
export class HealthDirectorateHealthConversationRecipient {
  @Field({ description: 'Hekla node ID of the recipient.' })
  nodeId!: string

  @Field(() => Int, {
    description: 'Hekla group ID of the recipient provider.',
  })
  groupId!: number

  @Field()
  name!: string

  @Field()
  allowsMessaging!: boolean

  @Field({
    description: 'Effective window open time (HH:mm:ss, UTC).',
  })
  messagingWindowOpen!: string

  @Field({
    description: 'Effective window close time (HH:mm:ss, UTC).',
  })
  messagingWindowClose!: string

  @Field()
  isCurrentlyWithinWindow!: boolean

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
