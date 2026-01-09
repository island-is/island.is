import type { GetWebChatQuery } from '@island.is/web/graphql/schema'

import {
  BoostChatPanel,
  LiveChatIncChatPanel,
  ZendeskChatPanel,
} from '../ChatPanel'

interface WebChatProps {
  webChat: GetWebChatQuery['getWebChat']
  pushUp?: boolean
}

const WebChat = ({ webChat, pushUp }: WebChatProps) => {
  if (!webChat) return null

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

// - Article

// // LiveChatInc
//   if (
//     article?.organization?.some((o) => o.id in liveChatIncConfig[activeLocale])
//   ) {
//     const organizationId = article.organization.find(
//       (o) => o.id in liveChatIncConfig[activeLocale],
//     )?.id
//     Component = (
//       <LiveChatIncChatPanel
//         {...liveChatIncConfig[activeLocale][organizationId ?? '']}
//         pushUp={pushUp}
//       />
//     )
//   }
//   // Watson
//   else if (article?.id && article.id in watsonConfig[activeLocale]) {
//     Component = (
//       <WatsonChatPanel
//         {...watsonConfig[activeLocale][article.id]}
//         pushUp={pushUp}
//       />
//     )
//   } else if (
//     article?.organization?.some((o) => o.id in watsonConfig[activeLocale])
//   ) {
//     const organizationId = article.organization.find(
//       (o) => o.id in watsonConfig[activeLocale],
//     )?.id
//     Component = (
//       <WatsonChatPanel
//         {...watsonConfig[activeLocale][organizationId ?? '']}
//         pushUp={pushUp}
//       />
//     )
//   }
//   // Boost
//   else if (
//     article?.organization?.some((o) => o.id in boostChatPanelEndpoints)
//   ) {
//     const organizationId = article.organization?.find(
//       (o) => o.id in boostChatPanelEndpoints,
//     )?.id as keyof typeof boostChatPanelEndpoints
//     Component = <BoostChatPanel endpoint={organizationId} pushUp={pushUp} />
//   }
//   // Zendesk
//   else if (
//     article?.organization?.some((o) => o.id in zendeskConfig[activeLocale])
//   ) {
//     const organizationId = article.organization.find(
//       (o) => o.id in zendeskConfig[activeLocale],
//     )?.id as keyof typeof zendeskConfig['is']
//     Component = (
//       <ZendeskChatPanel
//         {...zendeskConfig[activeLocale][organizationId]}
//         pushUp={pushUp}
//       />
//     )
//   } else if (
//     !article?.organization?.some((o) =>
//       excludedOrganizationWatsonConfig.includes(o.id),
//     )
//   ) {
//     Component = (
//       <WatsonChatPanel {...defaultWatsonConfig[activeLocale]} pushUp={pushUp} />
//     )
//   }

//   return Component

// - OrganizationWrapper
