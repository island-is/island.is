import { Field, InputType } from '@nestjs/graphql'
import { HealthDirectorateConversationAttachmentInput } from './healthConversationAttachment.input'

@InputType()
export class HealthDirectorateReplyToConversationInput {
  @Field()
  messageTextContent!: string

  @Field(() => [HealthDirectorateConversationAttachmentInput], {
    nullable: true,
  })
  attachments?: HealthDirectorateConversationAttachmentInput[]
}
