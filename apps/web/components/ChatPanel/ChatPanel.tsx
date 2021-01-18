import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Button, Icon } from '@island.is/island-ui/core'
import { config, ID, CONVERSATION_KEY, URL } from './config'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import * as styles from './ChatPanel.treat'

declare global {
  interface Window {
    boostInit: any
    boostChatPanel: any
    boost: any
  }
}

export const ChatPanel = () => {
  const { width } = useWindowSize()
  const [showButton, setShowButton] = useState(Boolean(window.boost))

  useEffect(() => {
    // init the chat panel if it does not exist
    if (!window?.boost) {
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
                  window.sessionStorage.getItem(CONVERSATION_KEY) ?? null,
              },
            },
          },
        }

        window.boost = window.boostInit(ID, settings)

        // to prevent us from opening chat where there is no space for it
        if (width > theme.breakpoints.md) {
          window.boost.chatPanel.show()
        }

        const onConversationIdChanged = (e) => {
          window.sessionStorage.setItem(
            CONVERSATION_KEY,
            e.detail.conversationId,
          )
        }

        window.boost.chatPanel.addEventListener(
          'conversationIdChanged',
          onConversationIdChanged,
        )

        setShowButton(true)
      })

      el.src = URL
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
