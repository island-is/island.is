import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { HealthConversationReplyBlockedReasonEnum } from './enums'
import { HealthDirectorateHealthConversation } from './healthConversation.model'
import { HealthDirectorateHealthConversationEntry } from './healthConversationEntry.model'

@ObjectType()
export class HealthDirectorateHealthConversationDetail extends HealthDirectorateHealthConversation {
  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field({
    description: 'Whether the patient can reply to this conversation right now.',
  })
  patientCanReply!: boolean

  @Field(() => HealthConversationReplyBlockedReasonEnum, {
    nullable: true,
    description: 'Why replying is blocked. Only set when patientCanReply is false.',
  })
  replyBlockedReason?: HealthConversationReplyBlockedReasonEnum

  @Field(() => [HealthDirectorateHealthConversationEntry])
  messages!: HealthDirectorateHealthConversationEntry[]
}
