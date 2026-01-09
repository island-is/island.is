export enum WebChatType {
  Zendesk = 'zendesk',
  LiveChat = 'livechat',
  Boost = 'boost',
  WatsonIBM = 'watsonIBM',
}

export type ZendeskConfiguration = {
  type: WebChatType.Zendesk
} & Record<
  string,
  {
    [WebChatType.Zendesk]?: {
      snippetUrl?: string
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

export type WatsonIBMConfiguration = {
  type: WebChatType.WatsonIBM
} & Record<
  string,
  {
    [WebChatType.WatsonIBM]?: {}
  }
>

export type Configuration =
  | ZendeskConfiguration
  | LiveChatConfiguration
  | BoostConfiguration
  | WatsonIBMConfiguration
