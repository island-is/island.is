import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

enum ThumbStatus {
  UP = 1,
  NO_CHOICE = 0,
  DOWN = -1,
}

registerEnumType(ThumbStatus, {
  name: 'WatsonAssistantChatSubmitFeedbackThumbStatus',
})

@InputType()
export class WatsonAssistantChatSubmitFeedbackInput {
  @Field(() => ThumbStatus)
  thumbStatus!: ThumbStatus

  @Field(() => String, { nullable: true })
  feedback?: string | null

  @Field(() => GraphQLJSONObject)
  assistantChatLog!: typeof GraphQLJSONObject
}
