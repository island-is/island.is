import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IdentityTokenInput } from './dto/identityToken.input'
import { IdentityTokenResponse } from './models/identityTokenResponse'
import { WatsonAssistantChatService } from './watson-assistant-chat.service'
import { SubmitFeedbackInput } from './dto/submitFeedback.input'
import { SubmitFeedbackResponse } from './models/submitFeedbackResponse'

@Resolver()
export class WatsonAssistantChatResolver {
  constructor(private watsonAssistantChatService: WatsonAssistantChatService) {}

  @Query(() => IdentityTokenResponse, {
    deprecationReason:
      'The IBM Watson chatbot has been removed from the frontend.',
  })
  watsonAssistantChatIdentityToken(@Args('input') input: IdentityTokenInput) {
    return this.watsonAssistantChatService.createIdentityToken(input)
  }

  @Mutation(() => SubmitFeedbackResponse, {
    deprecationReason:
      'The IBM Watson chatbot has been removed from the frontend.',
  })
  watsonAssistantChatSubmitFeedback(@Args('input') input: SubmitFeedbackInput) {
    return this.watsonAssistantChatService.submitFeedback(input)
  }
}
