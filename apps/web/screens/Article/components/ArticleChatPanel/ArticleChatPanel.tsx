import { WebChat } from '@island.is/web/components'
import {
  GetSingleArticleQuery,
  GetWebChatQuery,
} from '@island.is/web/graphql/schema'

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
  if (
    (article?.body ?? []).findIndex(
      (slice) =>
        slice.__typename === 'ConnectedComponent' &&
        slice.componentType === 'Police/FineAndSpeedMeasurementCalculator',
    ) !== -1
  )
    // Any article with the police fine calculator should not have a chat panel
    return null

  return <WebChat pushUp={pushUp} webChat={webChat} />
}

export default ArticleChatPanel
