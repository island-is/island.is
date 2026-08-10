import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { HealthConversationDirectionEnum } from './enums'
import { HealthDirectorateHealthConversationAttachment } from './healthConversationAttachment.model'
import { HealthDirectorateHealthConversationMessageContent } from './healthConversationMessageContent.model'

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

  @Field({
    nullable: true,
    deprecationReason: 'Use content instead.',
  })
  messageTextContent?: string

  @Field(() => HealthDirectorateHealthConversationMessageContent, {
    nullable: true,
    description:
      'Message body, one of text, segmented or video content. Null when the message has no renderable body.',
  })
  content?: typeof HealthDirectorateHealthConversationMessageContent

  @Field({ nullable: true })
  senderGroupName?: string

  @Field(() => [HealthDirectorateHealthConversationAttachment])
  attachments!: HealthDirectorateHealthConversationAttachment[]

  @Field({
    nullable: true,
    description:
      'Id of the certificate issued for this message, if any. Pass to the certificate query/mutations.',
  })
  certificateId?: string

  @Field({
    nullable: true,
    description:
      'True when the HCP charges patients for this certificate and it is gated behind a successful payment.',
  })
  requiresPayment?: boolean

  @Field({ nullable: true })
  paid?: boolean

  @Field(() => Int, {
    nullable: true,
    description:
      'Price the patient would be charged, in ISK. Only set when requiresPayment is true.',
  })
  amountIsk?: number
}
