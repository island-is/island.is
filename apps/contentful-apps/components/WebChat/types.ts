export enum WebChatType {
  Zendesk = 'zendesk',
  LiveChat = 'livechat',
  Boost = 'boost',
  WatsonIBM = 'watsonIBM',
}

export type ZendeskConfiguration = {
  type: WebChatType.Zendesk
  [WebChatType.Zendesk]?: {
    snippetUrl?: Record<string, string>
  }
}

export type LiveChatConfiguration = {
  type: WebChatType.LiveChat
  [WebChatType.LiveChat]?: {}
}

export type BoostConfiguration = {
  type: WebChatType.Boost
  [WebChatType.Boost]?: {}
}

export type WatsonIBMConfiguration = {
  type: WebChatType.WatsonIBM
  [WebChatType.WatsonIBM]?: {}
}

export type Configuration =
  | ZendeskConfiguration
  | LiveChatConfiguration
  | BoostConfiguration
  | WatsonIBMConfiguration
