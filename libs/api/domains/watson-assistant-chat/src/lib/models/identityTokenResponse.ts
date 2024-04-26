import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WatsonAssistantChatIdentityTokenResponse')
export class IdentityTokenResponse {
  @Field()
  token!: string
}
