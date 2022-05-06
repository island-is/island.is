import React from 'react'
import { GetSingleArticleQuery } from '@island.is/web/graphql/schema'
import {
  liveChatIncConfig,
  syslumennWatsonConfig,
  watsonConfig,
} from './config'
import {
  BoostChatPanel,
  boostChatPanelEndpoints,
  LiveChatIncChatPanel,
  WatsonChatPanel,
} from '@island.is/web/components'
import { useFeatureFlag } from '@island.is/web/hooks'

interface ArticleChatPanelProps {
  article: GetSingleArticleQuery['getSingleArticle']
  pushUp?: boolean
}

export const ArticleChatPanel = ({
  article,
  pushUp,
}: ArticleChatPanelProps) => {
  const { loading, value: isWatsonChatPanelEnabled } = useFeatureFlag(
    'isWatsonChatPanelEnabled',
    false,
  )
  if (loading) return null

  let Component = null

  if (article.id in liveChatIncConfig) {
    Component = <LiveChatIncChatPanel {...liveChatIncConfig[article.id]} />
  } else if (isWatsonChatPanelEnabled) {
    if (article.id in watsonConfig) {
      Component = <WatsonChatPanel {...watsonConfig[article.id]} />
    } else {
      Component = <WatsonChatPanel {...syslumennWatsonConfig} />
    }
  } else if (
    article.organization?.some((o) => o.id in boostChatPanelEndpoints)
  ) {
    Component = (
      <BoostChatPanel
        endpoint={
          article.organization?.find((o) => o.id in boostChatPanelEndpoints)
            ?.id as keyof typeof boostChatPanelEndpoints
        }
        pushUp={pushUp}
      />
    )
  }

  return Component
}

export default ArticleChatPanel
