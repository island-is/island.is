import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WatsonAssistantChatSubmitFeedbackResponse')
export class SubmitFeedbackResponse {
  @Field(() => Boolean)
  success!: boolean
}
