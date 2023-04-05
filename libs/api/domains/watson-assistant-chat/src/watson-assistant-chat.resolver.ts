import { Args, Resolver } from '@nestjs/graphql'
import { WatsonAssistantChatIdentityTokenInput } from './lib/dto/watsonAssistantChatIdentityToken.input'

@Resolver()
export class WatsonAssistantChatResolver {
  watsonAssistantChatIdentityToken(
    @Args('input') input: WatsonAssistantChatIdentityTokenInput,
  ) {
    // TODO: follow this guide: https://cloud.ibm.com/docs/assistant?topic=assistant-deploy-zendesk
    return {
      token: 'some-token',
    }
  }
}
