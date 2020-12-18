import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Button, Icon } from '@island.is/island-ui/core'
import { config, ID, CONVERSATION_KEY } from './config'

import * as styles from './ChatPanel.treat'

declare global {
  interface Window {
    boostInit: any
    boostChatPanel: any
  }
}

let boost = null

export const ChatPanel = () => {
  useEffect(() => {
    const conversationId =
      window.sessionStorage.getItem(CONVERSATION_KEY) ?? null
    const isABigWindow = window.innerWidth > 768

    if (!boost && window.boostInit) {
      const settings = {
        chatPanel: {
          ...config.chatPanel,
          styling: {
            ...config.chatPanel.styling,
            settings: {
              ...config.chatPanel.styling.settings,
              conversationId,
            },
          },
        },
      }

      boost = window.boostInit(ID, settings)

      // to prevent us from opening chat where there is no space for it
      if (isABigWindow) {
        boost.chatPanel.show()
      }

      boost.chatPanel.addEventListener(
        'conversationIdChanged',
        onConversationIdChanged,
      )
      boost.chatPanel.removeEventListener(
        'conversationIdChanged',
        onConversationIdChanged,
      )
    }
  }, [])

  const onConversationIdChanged = (e) => {
    window.sessionStorage.setItem(CONVERSATION_KEY, e.detail.conversationId)
  }

  return (
    <div className={cn(styles.root, { [styles.hidden]: !boost })}>
      <Button
        variant="primary"
        circle
        size="large"
        iconType="filled"
        onClick={() => {
          boost.chatPanel.show()
        }}
      >
        <Icon icon="chatbubble" color="white" size="large" type="outline" />
      </Button>
    </div>
  )
}

export default ChatPanel
