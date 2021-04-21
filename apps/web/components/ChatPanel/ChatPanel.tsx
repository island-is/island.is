import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Button, Icon } from '@island.is/island-ui/core'
import { config, endpoints } from './config'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import * as styles from './ChatPanel.treat'

declare global {
  interface Window {
    boostInit: any
    boostChatPanel: any
    boostEndpoint: string
    boost: any
  }
}

interface ChatPanelProps {
  endpoint: keyof typeof endpoints
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ endpoint }) => {
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

        // to prevent us from opening chat where there is no space for it
        if (width > theme.breakpoints.md) {
          window.boost.chatPanel.show()
        }

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
    <div className={cn(styles.root, { [styles.hidden]: !showButton })}>
      <Button
        variant="primary"
        circle
        size="large"
        iconType="filled"
        onClick={() => {
          window.boost.chatPanel.show()
        }}
      >
        <Icon icon="chatbubble" color="white" size="large" type="outline" />
      </Button>
    </div>
  )
}

export default ChatPanel
