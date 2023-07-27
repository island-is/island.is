import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class WatsonAssistantChatIdentityTokenInput {
  @Field()
  email!: string

  @Field()
  name!: string

  @Field()
  userID!: string
}
