import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class WatsonAssistantChatIdentityTokenResponse {
  @Field()
  token!: string
}
