import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'

import { Query, QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'

import { ChatBubble } from '../ChatBubble'
import { LiveChatIncChatPanelProps } from '../types'
import { activateWidget } from './utils'
import { LiveChatWidget, EventHandlerPayload } from '@livechat/widget-react'

export const LiveChatIncChatPanel = ({
  license,
  version,
  group,
  showLauncher,
  pushUp,
}: LiveChatIncChatPanelProps) => {
  const [widget, setWidget] = useState(null)
  const { activeLocale } = useI18n()
  const { data } = useQuery<Query, QueryGetNamespaceArgs>(GET_NAMESPACE_QUERY, {
    variables: {
      input: {
        lang: activeLocale,
        namespace: 'ChatPanels',
      },
    },
  })

  const namespace = useMemo(
    () => JSON.parse(data?.getNamespace?.fields || '{}'),
    [data?.getNamespace?.fields],
  )

  const n = useNamespace(namespace)

  return (
    <LiveChatWidget license={license} group={group} visibility="maximized" />
  )
}

export default LiveChatIncChatPanel
