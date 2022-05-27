import React from 'react'
import { GetSingleArticleQuery } from '@island.is/web/graphql/schema'
import {
  BoostChatPanel,
  boostChatPanelEndpoints,
  LiveChatIncChatPanel,
  WatsonChatPanel,
} from '@island.is/web/components'
import { defaultWatsonConfig, liveChatIncConfig, watsonConfig } from './config'

interface ArticleChatPanelProps {
  article: GetSingleArticleQuery['getSingleArticle']
  pushUp?: boolean
}

export const ArticleChatPanel = ({
  article,
  pushUp,
}: ArticleChatPanelProps) => {
  let Component = null

  // LiveChatInc
  if (article.organization?.some((o) => o.id in liveChatIncConfig)) {
    const organizationId = article.organization.find(
      (o) => o.id in liveChatIncConfig,
    ).id
    Component = <LiveChatIncChatPanel {...liveChatIncConfig[organizationId]} />
  }
  // Watson
  else if (article.id in watsonConfig) {
    Component = (
      <WatsonChatPanel {...watsonConfig[article.id]} pushUp={pushUp} />
    )
  } else if (article.organization?.some((o) => o.id in watsonConfig)) {
    const organizationId = article.organization.find(
      (o) => o.id in watsonConfig,
    ).id
    Component = (
      <WatsonChatPanel {...watsonConfig[organizationId]} pushUp={pushUp} />
    )
  }
  // Boost
  else if (article.organization?.some((o) => o.id in boostChatPanelEndpoints)) {
    const organizationId = article.organization?.find(
      (o) => o.id in boostChatPanelEndpoints,
    )?.id as keyof typeof boostChatPanelEndpoints
    Component = <BoostChatPanel endpoint={organizationId} pushUp={pushUp} />
  }
  // If none of the above then use the default watson chat bot
  else {
    Component = <WatsonChatPanel {...defaultWatsonConfig} pushUp={pushUp} />
  }

  return Component
}

export default ArticleChatPanel
