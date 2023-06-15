import { Args, Query, Resolver } from '@nestjs/graphql'
import { WatsonAssistantChatIdentityTokenInput } from './dto/watsonAssistantChatIdentityToken.input'
import { WatsonAssistantChatIdentityTokenResponse } from './models/watsonAssistantChatIdentityTokenResponse'
import { WatsonAssistantChatService } from './watson-assistant-chat.service'

@Resolver()
export class WatsonAssistantChatResolver {
  constructor(private watsonAssistantChatService: WatsonAssistantChatService) {}

  @Query(() => WatsonAssistantChatIdentityTokenResponse)
  watsonAssistantChatIdentityToken(
    @Args('input') input: WatsonAssistantChatIdentityTokenInput,
  ) {
    return this.watsonAssistantChatService.createIdentityToken(input)
  }
}
