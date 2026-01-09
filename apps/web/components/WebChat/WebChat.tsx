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

  if (
    webChatType === 'zendesk' &&
    webChat.webChatConfiguration.zendesk?.snippetUrl
  )
    return (
      <ZendeskChatPanel
        snippetUrl={webChat.webChatConfiguration.zendesk?.snippetUrl}
        pushUp={pushUp}
      />
    )

  if (webChatType === 'livechat') {
    const { license, version, group, showLauncher } =
      webChat.webChatConfiguration.livechat ?? {}
    if (!license || !version) return null
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
    if (!id || !conversationKey || !url) return null
    return (
      <BoostChatPanel
        id={id}
        conversationKey={conversationKey}
        url={url}
        pushUp={pushUp}
      />
    )
  }

  return null
}

export default WebChat
