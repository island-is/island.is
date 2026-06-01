import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class HealthDirectorateReplyToConversationInput {
  @Field()
  messageTextContent!: string
}
