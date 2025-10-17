import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { createWidget, ExtendedWindow } from '@livechat/widget-core'

import { Query, QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'

import { ChatBubble } from '../ChatBubble'
import { LiveChatIncChatPanelProps } from '../types'

declare const window: ExtendedWindow

export const LiveChatIncChatPanel = ({
  license,
  group,
  showLauncher,
  pushUp,
}: LiveChatIncChatPanelProps) => {
  const [loading, setLoading] = useState(false)
  const [hasButtonBeenClicked, setHasButtonBeenClicked] = useState(false)
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

  useEffect(() => {
    const queryParam = new URLSearchParams(window.location.search).get('wa_lid')
    if (
      !hasButtonBeenClicked &&
      !showLauncher &&
      !(queryParam && ['t10', 't11'].includes(queryParam))
    ) {
      return () => {
        // No need for cleanup if we don't initialize widget
      }
    }

    const widget = createWidget({
      license,
      group,
    })

    widget.init()

    window.LiveChatWidget.on('ready', () => {
      setLoading(false)
    })

    window.LiveChatWidget.on('visibility_changed', ({ visibility }) => {
      if (visibility === 'minimized' && !showLauncher) {
        window.LiveChatWidget.call('hide')
      }
    })

    window.LiveChatWidget.call('maximize')

    return () => {
      widget.destroy()
    }
  }, [group, hasButtonBeenClicked, license, showLauncher])

  if (showLauncher) {
    return null
  }

  return (
    <ChatBubble
      text={n('chatBubbleText', 'Hæ, get ég aðstoðað?')}
      isVisible={true}
      onClick={() => {
        if (!hasButtonBeenClicked) {
          setLoading(true)
          setHasButtonBeenClicked(true)
        } else if (!loading) {
          window.LiveChatWidget.call('maximize')
        }
      }}
      pushUp={pushUp}
      loading={loading}
    />
  )
}

export default LiveChatIncChatPanel
