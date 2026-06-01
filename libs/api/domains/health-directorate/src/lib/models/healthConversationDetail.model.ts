import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { HealthDirectorateHealthConversationEntry } from './healthConversationEntry.model'

@ObjectType()
export class HealthDirectorateHealthConversationDetail {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  status?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field(() => Int)
  messageCount!: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastMessageSentAt?: Date

  @Field({ nullable: true })
  lastSenderGroupName?: string

  @Field()
  hasAttachment!: boolean

  @Field()
  isStarred!: boolean

  @Field({
    description: 'True when the patient has archived this message thread.',
  })
  isArchived!: boolean

  @Field({
    nullable: true,
    description:
      'Whether the patient can reply. Null means no staff decision yet — replies are allowed unless explicitly false.',
  })
  patientCanReply?: boolean

  @Field({
    description:
      'True when the patient has read the latest message in this thread.',
  })
  isRead!: boolean

  @Field(() => [HealthDirectorateHealthConversationEntry])
  messages!: HealthDirectorateHealthConversationEntry[]
}
