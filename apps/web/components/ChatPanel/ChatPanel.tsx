import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Button, Icon } from '@island.is/island-ui/core'
import { Boost } from './types'
import { config, ID, URL } from './config'

import * as styles from './ChatPanel.treat'

declare global {
  interface Window {
    boostInit: any
    boostChatPanel: any
  }
}

export const ChatPanel = () => {
  const [visible, setVisible] = useState<boolean>(true)
  const [boost, setBoost] = useState<Boost | null>(null)

  useEffect(() => {
    if (!boost) {
      setBoost(window.boostInit(ID, config))
    }
  }, [])

  const onChatPanelClosed = () => {
    setVisible(true)
  }

  useEffect(() => {
    if (boost) {
      boost.chatPanel.addEventListener('chatPanelClosed', onChatPanelClosed)
      boost.chatPanel.addEventListener('chatPanelClosed', onChatPanelClosed)
    }
  }, [boost])

  if (!boost) {
    return null
  }

  return (
    <div className={cn(styles.root, { [styles.hidden]: !visible })}>
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
