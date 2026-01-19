import { WatsonChatPanel, WebChat } from '@island.is/web/components'
import {
  GetSingleArticleQuery,
  GetWebChatQuery,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import {
  defaultWatsonConfig,
  excludedOrganizationWatsonConfig,
  watsonConfig,
} from './config'

interface ArticleChatPanelProps {
  article: GetSingleArticleQuery['getSingleArticle']
  pushUp?: boolean
  webChat: GetWebChatQuery['getWebChat']
}

export const ArticleChatPanel = ({
  article,
  pushUp,
  webChat,
}: ArticleChatPanelProps) => {
  const { activeLocale } = useI18n()
  if (
    (article?.body ?? []).findIndex(
      (slice) =>
        slice.__typename === 'ConnectedComponent' &&
        slice.componentType === 'Police/FineAndSpeedMeasurementCalculator',
    ) !== -1
  ) {
    // Any article with the police fine calculator should not have a chat panel
    return null
  }

  return (
    <WebChat
      pushUp={pushUp}
      webChat={webChat}
      renderFallback={() => {
        if (article?.id && article.id in watsonConfig[activeLocale])
          return (
            <WatsonChatPanel
              {...watsonConfig[activeLocale][article.id]}
              pushUp={pushUp}
            />
          )

        if (
          article?.organization?.some((o) => o.id in watsonConfig[activeLocale])
        ) {
          const organizationId = article.organization.find(
            (o) => o.id in watsonConfig[activeLocale],
          )?.id
          return (
            <WatsonChatPanel
              {...watsonConfig[activeLocale][organizationId ?? '']}
              pushUp={pushUp}
            />
          )
        }

        if (
          !article?.organization?.some((o) =>
            excludedOrganizationWatsonConfig.includes(o.id),
          )
        )
          return (
            <WatsonChatPanel
              {...defaultWatsonConfig[activeLocale]}
              pushUp={pushUp}
            />
          )

        return null
      }}
    />
  )
}

export default ArticleChatPanel
