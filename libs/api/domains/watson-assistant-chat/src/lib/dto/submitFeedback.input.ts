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

@InputType('WatsonAssistantChatSubmitFeedbackInput')
export class SubmitFeedbackInput {
  @Field(() => ThumbStatus)
  thumbStatus!: ThumbStatus

  @Field(() => String, { nullable: true })
  feedback?: string | null

  @Field(() => [GraphQLJSONObject])
  assistantChatLog!: typeof GraphQLJSONObject[]
}
