export interface BoostChatPanelProps {
  id: string
  conversationKey: string
  url: string
  pushUp?: boolean
}

export interface LiveChatIncChatPanelProps {
  license: string
  version: string
  group?: string
  // Whether the default LiveChatInc launcher is shown
  showLauncher?: boolean
  pushUp?: boolean
}

export interface ZendeskChatPanelProps {
  snippetUrl: string
  pushUp?: boolean
  chatBubbleVariant?: 'default' | 'circle'
  urlTrackingTicketId?: string
  chatBubbleTitle?: string
}
