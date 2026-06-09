import { Field, InputType } from '@nestjs/graphql'
import { HealthDirectorateMessageAttachmentInput } from './healthMessageAttachment.input'

@InputType()
export class HealthDirectorateReplyToMessageInput {
  @Field()
  messageTextContent!: string

  @Field(() => [HealthDirectorateMessageAttachmentInput], { nullable: true })
  attachments?: HealthDirectorateMessageAttachmentInput[]
}
