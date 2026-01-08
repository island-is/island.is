export enum WebChatType {
  Zendesk = 'Zendesk',
  LiveChat = 'LiveChat',
  Boost = 'Boost',
  WatsonIBM = 'WatsonIBM',
}

export type ZendeskConfiguration = {
  type: WebChatType.Zendesk
  snippetUrl?: Record<string, string>
}

export type LiveChatConfiguration = {
  type: WebChatType.LiveChat
}

export type BoostConfiguration = {
  type: WebChatType.Boost
}

export type WatsonIBMConfiguration = {
  type: WebChatType.WatsonIBM
}

export type Configuration =
  | ZendeskConfiguration
  | LiveChatConfiguration
  | BoostConfiguration
  | WatsonIBMConfiguration
