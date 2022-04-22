import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { FocusableBox, Text } from '@island.is/island-ui/core'
import { config, endpoints } from './config'
import { useWindowSize } from 'react-use'
import * as styles from './BoostChatPanel.css'

declare global {
  interface Window {
    boostInit: any
    boostChatPanel: any
    boostEndpoint: string
    boost: any
  }
}

interface BoostChatPanelProps {
  endpoint: keyof typeof endpoints
  pushUp?: boolean
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
    <div className={cn(styles.root, { [styles.hidden]: !showButton })}>
      <FocusableBox
        component="button"
        tabIndex={0}
        className={cn(styles.message, pushUp && styles.messagePushUp)}
        onClick={() => {
          window.boost.chatPanel.show()
        }}
      >
        <Text variant="h5" color="white">
          Hæ, get ég aðstoðað?
        </Text>
        <div className={styles.messageArrow} />
        <div className={styles.messageArrowBorder} />
      </FocusableBox>
    </div>
  )
}

export default BoostChatPanel
