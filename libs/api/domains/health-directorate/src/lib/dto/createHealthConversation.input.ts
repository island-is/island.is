import { Field, InputType, Int } from '@nestjs/graphql'
import { HealthDirectorateConversationAttachmentInput } from './healthConversationAttachment.input'

@InputType()
export class HealthDirectorateCreateConversationInput {
  @Field()
  nodeId!: string

  @Field(() => Int)
  groupId!: number

  @Field()
  patientInitiatedTypeCode!: string

  @Field({ nullable: true })
  title?: string

  @Field()
  messageTextContent!: string

  @Field(() => [HealthDirectorateConversationAttachmentInput], { nullable: true })
  attachments?: HealthDirectorateConversationAttachmentInput[]
}
