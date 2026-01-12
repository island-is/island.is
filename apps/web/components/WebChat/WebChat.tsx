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
    const snippetUrl = webChat.webChatConfiguration.zendesk?.snippetUrl
    if (!snippetUrl) return renderFallback?.() ?? null
    return <ZendeskChatPanel snippetUrl={snippetUrl} pushUp={pushUp} />
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
