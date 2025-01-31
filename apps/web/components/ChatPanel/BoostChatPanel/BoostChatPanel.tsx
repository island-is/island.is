import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'

import { Query, QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import { useNamespaceStrict } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'

import { ChatBubble } from '../ChatBubble'
import { BoostChatPanelProps } from '../types'
import { boostChatPanelEndpoints, config } from './config'

declare global {
  interface Window {
    boostInit: any
    boostChatPanel: any
    boostEndpoint: string
    boost: any
  }
}

export const BoostChatPanel: React.FC<
  React.PropsWithChildren<BoostChatPanelProps>
> = ({ endpoint, pushUp = false }) => {
  const [showButton, setShowButton] = useState(Boolean(window.boost)) // we show button when chat already loaded
  const { activeLocale } = useI18n()

  useEffect(() => {
    // recreate the chat panel if we are on a different endpoint
    if (window.boostEndpoint !== endpoint) {
      document.getElementById('boost-script')?.remove()
      const el = document.createElement('script')
      el.addEventListener('load', () => {
        const settings = {
          chatPanel: {
            ...config.chatPanel,
            styling: {
              ...config?.chatPanel?.styling,
              settings: {
                ...config?.chatPanel?.styling?.settings,
                conversationId:
                  window.sessionStorage.getItem(
                    boostChatPanelEndpoints[endpoint].conversationKey,
                  ) ?? null,
              },
            },
          },
        }

        window.boost = window.boostInit(
          boostChatPanelEndpoints[endpoint].id,
          settings,
        )
        window.boostEndpoint = endpoint

        const onConversationIdChanged = (e: {
          detail: { conversationId: string }
        }) => {
          window.sessionStorage.setItem(
            boostChatPanelEndpoints[endpoint].conversationKey,
            e.detail.conversationId,
          )
        }

        window.boost.chatPanel.addEventListener(
          'conversationIdChanged',
          onConversationIdChanged,
        )

        setShowButton(true)

        const queryParam = new URLSearchParams(window.location.search).get(
          'wa_lid',
        )
        if (queryParam && ['t10', 't11'].includes(queryParam)) {
          window.boost.chatPanel.setStartLanguage(
            activeLocale === 'en' ? 'en-US' : 'is-IS',
          )
          window.boost.chatPanel.show()
        }
      })

      el.src = boostChatPanelEndpoints[endpoint].url
      el.id = 'boost-script'
      document.body.appendChild(el)
    }

    return () => {
      window.boost?.chatPanel?.minimize()
    }
  }, [activeLocale, endpoint])

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

  const n = useNamespaceStrict(namespace)

  return (
    <ChatBubble
      text={n('chatBubbleText', 'Hæ, get ég aðstoðað?')}
      onClick={() => {
        window.boost.chatPanel.setStartLanguage(
          activeLocale === 'en' ? 'en-US' : 'is-IS',
        )
        window.boost.chatPanel.show()
      }}
      isVisible={showButton}
      pushUp={pushUp}
    />
  )
}

export default BoostChatPanel
