import { Field, InputType, Int } from '@nestjs/graphql'
import { HealthDirectorateMessageAttachmentInput } from './healthMessageAttachment.input'

@InputType()
export class HealthDirectorateCreateMessageInput {
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

  @Field(() => [HealthDirectorateMessageAttachmentInput], { nullable: true })
  attachments?: HealthDirectorateMessageAttachmentInput[]
}
