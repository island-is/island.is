import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

export enum ThumbStatus {
  Up = 'Up',
  NoChoice = 'NoChoice',
  Down = 'Down',
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

  @Field(() => [GraphQLJSONObject])
  assistantChatLog!: typeof GraphQLJSONObject[]
}
