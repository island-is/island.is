import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { HealthConversationReplyBlockedReasonEnum } from './enums'
import { HealthDirectorateHealthConversation } from './healthConversation.model'
import { HealthDirectorateHealthConversationEntry } from './healthConversationEntry.model'

@ObjectType()
export class HealthDirectorateHealthConversationDetail extends HealthDirectorateHealthConversation {
  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field({
    description:
      'Whether the patient can reply to this conversation right now.',
  })
  patientCanReply!: boolean

  @Field(() => HealthConversationReplyBlockedReasonEnum, {
    nullable: true,
    description:
      'Why replying is blocked. Only set when patientCanReply is false.',
  })
  replyBlockedReason?: HealthConversationReplyBlockedReasonEnum

  @Field({
    nullable: true,
    description:
      'When the recipient starts accepting messages, as HH:mm:ss in UTC.',
  })
  messagingWindowOpen?: string

  @Field({
    nullable: true,
    description:
      'When the recipient stops accepting messages, as HH:mm:ss in UTC.',
  })
  messagingWindowClose?: string

  @Field(() => Int, {
    nullable: true,
    description:
      'How long the thread accepts replies, in 24-hour periods from the newest staff message.',
  })
  patientReplyWindowDays?: number

  @Field(() => [HealthDirectorateHealthConversationEntry])
  messages!: HealthDirectorateHealthConversationEntry[]
}
