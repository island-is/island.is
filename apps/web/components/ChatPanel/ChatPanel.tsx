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
  const [visible, setVisible] = useState<boolean>(true)

  useEffect(() => {
    const conversationId =
      window.sessionStorage.getItem(CONVERSATION_KEY) ?? null

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

      boost.chatPanel.addEventListener('chatPanelClosed', onChatPanelClosed)
      boost.chatPanel.addEventListener(
        'conversationIdChanged',
        onConversationIdChanged,
      )
    }
  }, [])

  const onChatPanelClosed = () => {
    setVisible(true)
  }

  const onConversationIdChanged = (e) => {
    window.sessionStorage.setItem(CONVERSATION_KEY, e.detail.conversationId)
  }

  return (
    <div className={cn(styles.root, { [styles.hidden]: !boost || !visible })}>
      <Button
        variant="primary"
        circle
        disabled={!visible}
        size="large"
        iconType="filled"
        onClick={() => {
          boost.chatPanel.show()
          setVisible(false)
        }}
      >
        <Icon icon="chatbubble" color="white" size="large" type="outline" />
      </Button>
    </div>
  )
}

export default ChatPanel
