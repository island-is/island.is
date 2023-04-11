import { Args, Resolver } from '@nestjs/graphql'
import { WatsonAssistantChatIdentityTokenInput } from './lib/dto/watsonAssistantChatIdentityToken.input'
import { WatsonAssistantChatService } from './watson-assistant-chat.service'

@Resolver()
export class WatsonAssistantChatResolver {
  constructor(private watsonAssistantChatService: WatsonAssistantChatService) {}

  watsonAssistantChatIdentityToken(
    @Args('input') input: WatsonAssistantChatIdentityTokenInput,
  ) {
    return this.watsonAssistantChatService.getIdentityToken(input)
  }
}
