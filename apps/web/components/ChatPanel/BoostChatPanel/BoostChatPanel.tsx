import React, { useEffect, useState } from 'react'
import { config, endpoints } from './config'
import { useWindowSize } from 'react-use'
import { ChatBubble } from '../ChatBubble'
import { BoostChatPanelProps } from '../types'

declare global {
  interface Window {
    boostInit: any
    boostChatPanel: any
    boostEndpoint: string
    boost: any
  }
}

export const BoostChatPanel: React.FC<BoostChatPanelProps> = ({
  endpoint,
  pushUp = false,
}) => {
  const { width } = useWindowSize()
  const [showButton, setShowButton] = useState(Boolean(window.boost)) // we show button when chat already loaded

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
              ...config.chatPanel.styling,
              settings: {
                ...config.chatPanel.styling.settings,
                conversationId:
                  window.sessionStorage.getItem(
                    endpoints[endpoint].conversationKey,
                  ) ?? null,
              },
            },
          },
        }

        window.boost = window.boostInit(endpoints[endpoint].id, settings)
        window.boostEndpoint = endpoint

        const onConversationIdChanged = (e) => {
          window.sessionStorage.setItem(
            endpoints[endpoint].conversationKey,
            e.detail.conversationId,
          )
        }

        window.boost.chatPanel.addEventListener(
          'conversationIdChanged',
          onConversationIdChanged,
        )

        setShowButton(true)
      })

      el.src = endpoints[endpoint].url
      el.id = 'boost-script'
      document.body.appendChild(el)
    }
  }, [])

  return (
    <ChatBubble
      text={'Hæ, get ég aðstoðað?'}
      onClick={() => window.boost.chatPanel.show()}
      pushUp={pushUp}
      isVisible={showButton}
    />
  )
}

export default BoostChatPanel
