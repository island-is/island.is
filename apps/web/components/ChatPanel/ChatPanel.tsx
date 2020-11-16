import React, { FC, useEffect, useState } from 'react'
import { Boost, ChatPanelConfig } from './types'
import { defaultConfig } from './config'

import * as styles from './ChatPanel.treat'

declare global {
  interface Window {
    boostInit: any
  }
}

interface ChatPanelProps {
  src?: string
  config?: ChatPanelConfig
}

const ID = '246covid-island-chat-panel'
const URL = 'https://246covid-island.boost.ai/chatPanel/chatPanel.js'

export const ChatPanel: FC<ChatPanelProps> = ({
  src = URL,
  config = defaultConfig,
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [boost, setBoost] = useState<Boost | null>(null)

  useEffect(() => {
    if (!document.getElementById(ID)) {
      const el = document.createElement('script')
      el.setAttribute('id', ID)
      el.setAttribute('src', src)
      document.head.appendChild(el)
      setTimeout(
        () => setBoost(window.boostInit('246covid-island', config)),
        1000,
      )
    }
  }, [])

  useEffect(() => {
    if (boost) {
      if (!open) {
        boost.chatPanel.show()
      }
    }
  }, [open, boost])

  if (boost) {
  }

  return <div className={styles.root}>This is the chat panel</div>
}

export default ChatPanel
