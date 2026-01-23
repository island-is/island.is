export enum WebChatType {
  Zendesk = 'zendesk',
  LiveChat = 'livechat',
  Boost = 'boost',
  Watson = 'watson',
}

export type WatsonConfiguration = {
  type: WebChatType.Watson
} & Record<
  string,
  {
    [WebChatType.Watson]?: {
      integrationID?: string
      region?: string
      serviceInstanceID?: string
      showLauncher?: boolean
      carbonTheme?: string
      namespaceKey?: string
      serviceDesk?: {
        integrationType?: string
        genesysMessenger?: {
          scriptURL?: string
          deploymentID?: string
          environment?: string
        }
        skipConnectAgentCard?: boolean
      }
      setupOneScreenWatsonChatBotParams?: {
        categoryTitle?: string
        categoryGroup?: string
      }
      clearSessionStorageParams?: {
        categoryGroup?: string
      }
    }
  }
>

export type ZendeskConfiguration = {
  type: WebChatType.Zendesk
} & Record<
  string,
  {
    [WebChatType.Zendesk]?: {
      snippetUrl?: string
      chatBubbleVariant?: 'default' | 'circle'
    }
  }
>

export type LiveChatConfiguration = {
  type: WebChatType.LiveChat
} & Record<
  string,
  {
    [WebChatType.LiveChat]?: {
      license?: string
      version?: string
      group?: string
      showLauncher?: boolean
    }
  }
>

export type BoostConfiguration = {
  type: WebChatType.Boost
} & Record<
  string,
  {
    [WebChatType.Boost]?: {
      id?: string
      conversationKey?: string
      url?: string
    }
  }
>

export type Configuration =
  | ZendeskConfiguration
  | LiveChatConfiguration
  | BoostConfiguration
  | WatsonConfiguration
