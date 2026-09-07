import { Field, ID, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class HealthDirectorateConversationIdInput {
  @Field(() => ID)
  @IsString()
  id!: string
}
