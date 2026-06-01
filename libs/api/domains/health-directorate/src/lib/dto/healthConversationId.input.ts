import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class HealthDirectorateConversationIdInput {
  @Field(() => ID)
  id!: string
}
