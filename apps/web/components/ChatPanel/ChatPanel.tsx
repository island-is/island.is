import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Icon } from '@island.is/island-ui/core'
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
  const [showToggler, setShowToggler] = useState<boolean>(true)
  const [boost, setBoost] = useState<Boost | null>(null)

  useEffect(() => {
    if (!boost) {
      setBoost(window.boostInit(ID, config))
    }
  }, [])

  const onChatPanelClosed = () => {
    setShowToggler(true)
  }

  if (!boost) {
    console.log('no boost', boost, window.boostInit)
  } else {
    console.log('boost', boost, window.boostInit)
  }

  if (!boost) {
    return <div>OK!</div>
  }

  return (
    <div className={cn(styles.button, { [styles.hidden]: !showToggler })}>
      <button
        className={cn(styles.button)}
        onClick={() => {
          boost.chatPanel.show()
          setShowToggler(!showToggler)
        }}
      >
        <Icon icon="accessibility" color="red600" />
      </button>
    </div>
  )
}

export default ChatPanel
