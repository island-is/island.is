import { Provider } from '@nestjs/common'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { WatsonAssistantChatService } from './watson-assistant-chat.service'
import { WatsonAssistantChatConfig } from './watson-assistant-chat.config'

export const WatsonAssistantChatServiceProvider: Provider<WatsonAssistantChatService> =
  {
    provide: WatsonAssistantChatService,
    scope: LazyDuringDevScope,
    useFactory(config: ConfigType<typeof WatsonAssistantChatConfig>) {
      return new WatsonAssistantChatService(config)
    },
    inject: [WatsonAssistantChatConfig.KEY],
  }
