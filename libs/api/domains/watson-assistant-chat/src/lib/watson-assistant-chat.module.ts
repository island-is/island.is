import { Module } from '@nestjs/common'
import { WatsonAssistantChatServiceProvider } from './serviceProvider'
import { WatsonAssistantChatResolver } from './watson-assistant-chat.resolver'

@Module({
  providers: [WatsonAssistantChatServiceProvider, WatsonAssistantChatResolver],
})
export class WatsonAssistantChatModule {}
