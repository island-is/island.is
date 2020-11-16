import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Icon } from '@island.is/island-ui/core'
import { Boost } from './types'
import { config, ID, URL } from './config'

import * as styles from './ChatPanel.treat'

declare global {
  interface Window {
    boostInit: any
  }
}

export const ChatPanel = () => {
  const [show, setShow] = useState<boolean>(true)
  const [boost, setBoost] = useState<Boost | null>(null)

  useEffect(() => {
    if (window.boostInit) {
      setBoost(window.boostInit('246covid-island', config))
    }
  }, [])

  if (!boost) {
    return null
  }

  console.log('boost', boost)

  return (
    <div className={cn(styles.button, { [styles.hidden]: !show })}>
      <button className={cn(styles.button)} onClick={boost.chatPanel.show}>
        <Icon icon="accessibility" color="red600" />
      </button>
    </div>
  )
}

export default ChatPanel
