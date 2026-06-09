import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { HealthConversationDirectionEnum } from './enums'
import { HealthDirectorateHealthConversationAttachment } from './healthConversationAttachment.model'

@ObjectType()
export class HealthDirectorateHealthConversationEntry {
  @Field(() => ID)
  id!: string

  @Field(() => HealthConversationDirectionEnum, {
    description: 'Author of the message: PATIENT, STAFF, or SYSTEM.',
  })
  direction!: HealthConversationDirectionEnum

  @Field(() => GraphQLISODateTime)
  messageSentAt!: Date

  @Field({ nullable: true })
  messageTextContent?: string

  @Field({ nullable: true })
  senderGroupName?: string

  @Field(() => [HealthDirectorateHealthConversationAttachment])
  attachments!: HealthDirectorateHealthConversationAttachment[]
}
