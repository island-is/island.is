import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class WatsonAssistantChatSubmitFeedbackResponse {
  @Field(() => Boolean)
  success!: boolean
}
