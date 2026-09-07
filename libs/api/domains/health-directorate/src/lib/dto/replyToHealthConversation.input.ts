import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class HealthDirectorateReplyToConversationInput {
  @Field(() => ID)
  @IsString()
  id!: string

  @Field()
  @IsNotEmpty()
  messageTextContent!: string
}
