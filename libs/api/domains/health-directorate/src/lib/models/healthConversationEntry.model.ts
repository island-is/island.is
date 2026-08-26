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
      'Id of the certificate issued for this message, if any. Pass to the certificate query/mutations. Absent when requiresPayment is true but the certificate has not materialised yet — render no pay affordance in that case.',
  })
  certificateId?: string

  @Field({
    nullable: true,
    description:
      'True when the attached certificate is gated behind a successful payment.',
  })
  requiresPayment?: boolean

  @Field({
    nullable: true,
    description: 'True when the attached certificate has been paid for.',
  })
  paid?: boolean

  @Field(() => Int, {
    nullable: true,
    description:
      'Price the patient would be charged, in ISK. Only set when requiresPayment is true.',
  })
  amountIsk?: number

  @Field({
    nullable: true,
    description:
      'A payment the patient has already started for this certificate and which has not yet expired. When set, show a pending-payment state and poll the certificate query rather than opening a new payment intent.',
  })
  pendingPaymentId?: string
}
