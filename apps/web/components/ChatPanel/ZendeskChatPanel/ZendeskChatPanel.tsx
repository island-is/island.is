import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'

import { Query, QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'

import { ChatBubble } from '../ChatBubble'
import type { ZendeskChatPanelProps } from '../types'
import type { ZendeskMessengerAPI } from './types'

/* Documentation: https://developer.zendesk.com/api-reference/widget-messaging/web/core/ */

const SCRIPT_ID = 'ze-snippet'

declare global {
  interface Window {
    zE?: ZendeskMessengerAPI
  }
}

export const ZendeskChatPanel = ({
  snippetUrl,
  pushUp = false,
  chatBubbleVariant = 'circle',
}: ZendeskChatPanelProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { activeLocale } = useI18n()

  const loadScript = useCallback(() => {
    const setup = () => {
      setIsChatOpen(true)
      setIsLoading(false)
      window.zE?.(
        'messenger:set',
        'locale',
        activeLocale === 'en' ? 'en-US' : activeLocale,
      )
      window.zE?.('messenger', 'show')
      window.zE?.('messenger', 'open')
      window.zE?.('messenger:on', 'close', () => {
        setIsChatOpen(false)
        window.zE?.('messenger', 'hide')
      })
    }

    const existingScript = document.getElementById(SCRIPT_ID)
    if (existingScript) existingScript.remove()

    setIsLoading(true)
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = snippetUrl
    script.async = true
    document.body.appendChild(script)
    script.onload = setup
    script.onerror = (error) => {
      console.error(error)
      setIsLoading(false)
    }
  }, [activeLocale, snippetUrl])

  useEffect(
    () => () => {
      window.zE?.('messenger', 'hide')
      document.getElementById(SCRIPT_ID)?.remove()
    },
    [],
  )

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
    <ChatBubble
      onClick={loadScript}
      text={n('chatBubbleText', 'Hæ, get ég aðstoðað?')}
      variant={chatBubbleVariant}
      pushUp={pushUp}
      loading={isLoading}
      isVisible={!isChatOpen}
    />
  )
}
