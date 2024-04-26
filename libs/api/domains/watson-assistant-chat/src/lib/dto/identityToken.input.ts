import { Field, InputType } from '@nestjs/graphql'

@InputType('WatsonAssistantChatIdentityTokenInput')
export class IdentityTokenInput {
  @Field()
  email!: string

  @Field()
  name!: string

  @Field()
  userID!: string
}
