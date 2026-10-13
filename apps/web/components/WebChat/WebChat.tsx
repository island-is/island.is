import type { GetWebChatQuery } from '@island.is/web/graphql/schema'

import {
  BoostChatPanel,
  LiveChatIncChatPanel,
  ZendeskChatPanel,
} from '../ChatPanel'

interface WebChatProps {
  webChat: GetWebChatQuery['getWebChat']
  pushUp?: boolean
  renderFallback?: () => React.ReactNode
}

const WebChat = ({ webChat, pushUp, renderFallback }: WebChatProps) => {
  if (!webChat) return renderFallback?.() ?? null

  const webChatType = webChat.webChatConfiguration?.type

  if (webChatType === 'zendesk') {
    const {
      snippetUrl,
      chatBubbleVariant,
      urlTrackingTicketId,
      chatBubbleTitle,
    } = webChat.webChatConfiguration.zendesk ?? {}
    if (!snippetUrl) return renderFallback?.() ?? null

    let ticketId: string = urlTrackingTicketId ?? ''
    if (ticketId.length > 0 && ticketId.trim() === '') ticketId = ''
    else if (!ticketId.trim()) ticketId = '36130758325906'
    else ticketId = ticketId.trim()

    return (
      <ZendeskChatPanel
        snippetUrl={snippetUrl}
        pushUp={pushUp}
        chatBubbleVariant={chatBubbleVariant || 'circle'}
        urlTrackingTicketId={ticketId}
        chatBubbleTitle={chatBubbleTitle}
      />
    )
  }

  if (webChatType === 'livechat') {
    const { license, version, group, showLauncher } =
      webChat.webChatConfiguration.livechat ?? {}
    if (!license || !version) return renderFallback?.() ?? null
    return (
      <LiveChatIncChatPanel
        license={license}
        version={version}
        group={group}
        showLauncher={showLauncher}
        pushUp={pushUp}
      />
    )
  }

  if (webChatType === 'boost') {
    const { id, conversationKey, url } =
      webChat.webChatConfiguration.boost ?? {}
    if (!id || !conversationKey || !url) return renderFallback?.() ?? null
    return (
      <BoostChatPanel
        id={id}
        conversationKey={conversationKey}
        url={url}
        pushUp={pushUp}
      />
    )
  }

  return renderFallback?.() ?? null
}

export default WebChat
