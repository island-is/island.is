import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { WatsonAssistantChatIdentityTokenInput } from './dto/watsonAssistantChatIdentityToken.input'
import { WatsonAssistantChatIdentityTokenResponse } from './models/watsonAssistantChatIdentityTokenResponse'
import { WatsonAssistantChatService } from './watson-assistant-chat.service'
import { WatsonAssistantChatSubmitFeedbackInput } from './dto/watsonAssistantChatSubmitFeedback.input'
import { WatsonAssistantChatSubmitFeedbackResponse } from './models/watsonAssistantChatSubmitFeedbackResponse'

@Resolver()
export class WatsonAssistantChatResolver {
  constructor(private watsonAssistantChatService: WatsonAssistantChatService) {}

  @Query(() => WatsonAssistantChatIdentityTokenResponse)
  watsonAssistantChatIdentityToken(
    @Args('input') input: WatsonAssistantChatIdentityTokenInput,
  ) {
    return this.watsonAssistantChatService.createIdentityToken(input)
  }

  @Mutation(() => WatsonAssistantChatSubmitFeedbackResponse)
  watsonAssistantChatSubmitFeedback(
    @Args('input') input: WatsonAssistantChatSubmitFeedbackInput,
  ) {
    return this.watsonAssistantChatService.submitFeedback(input)
  }
}
