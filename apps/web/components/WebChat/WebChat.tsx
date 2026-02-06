import type { GetWebChatQuery } from '@island.is/web/graphql/schema'
import { setupOneScreenWatsonChatBot } from '@island.is/web/utils/webChat'

import {
  BoostChatPanel,
  LiveChatIncChatPanel,
  WatsonChatPanel,
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
    const { snippetUrl, chatBubbleVariant } =
      webChat.webChatConfiguration.zendesk ?? {}
    if (!snippetUrl) return renderFallback?.() ?? null
    return (
      <ZendeskChatPanel
        snippetUrl={snippetUrl}
        pushUp={pushUp}
        chatBubbleVariant={chatBubbleVariant || 'circle'}
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

  if (webChatType === 'watson') {
    const {
      integrationID,
      region,
      serviceInstanceID,
      showLauncher,
      carbonTheme,
      namespaceKey,
      serviceDesk,
      setupOneScreenWatsonChatBotParams,
      clearSessionStorageParams,
    } = webChat.webChatConfiguration.watson ?? {}
    if (!integrationID || !region || !serviceInstanceID)
      return renderFallback?.() ?? null

    return (
      <WatsonChatPanel
        integrationID={integrationID}
        region={region}
        serviceInstanceID={serviceInstanceID}
        showLauncher={showLauncher}
        carbonTheme={carbonTheme}
        namespaceKey={namespaceKey}
        serviceDesk={serviceDesk}
        onLoad={(instance) => {
          const initialState = setupOneScreenWatsonChatBotParams
          if (initialState?.categoryTitle && initialState?.categoryGroup) {
            setupOneScreenWatsonChatBot(
              instance,
              initialState.categoryTitle,
              initialState.categoryGroup,
            )
            return
          }

          const categoryGroupClearParam =
            clearSessionStorageParams?.categoryGroup
          if (
            categoryGroupClearParam &&
            sessionStorage.getItem(categoryGroupClearParam)
          )
            sessionStorage.clear()
        }}
      />
    )
  }
  return renderFallback?.() ?? null
}

export default WebChat
