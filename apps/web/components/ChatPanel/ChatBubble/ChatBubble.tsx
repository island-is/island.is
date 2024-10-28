import React, { useRef, useState } from 'react'
import cn from 'classnames'

import { Box, FocusableBox, LoadingDots, Text } from '@island.is/island-ui/core'

import {
  EmbedDisclaimer,
  type EmbedDisclaimerProps,
} from './EmbedDisclaimer/EmbedDisclaimer'
import * as styles from './ChatBubble.css'

interface ChatBubbleProps {
  text: string
  pushUp?: boolean
  isVisible?: boolean
  onClick?: () => void
  loading?: boolean
  embedDisclaimerProps?: Pick<EmbedDisclaimerProps, 'localStorageKey' | 'texts'>
}

export const ChatBubble = ({
  text,
  isVisible = true,
  onClick,
  pushUp = false,
  loading = false,
  embedDisclaimerProps,
}: ChatBubbleProps) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const hasButtonBeenClicked = useRef(false)

  return (
    <>
      {isConfirmModalOpen && embedDisclaimerProps && (
        <EmbedDisclaimer
          localStorageKey={embedDisclaimerProps.localStorageKey}
          onAnswer={(acceptsTerms) => {
            setIsConfirmModalOpen(false)
            if (acceptsTerms) {
              hasButtonBeenClicked.current = true
              onClick?.()
            }
          }}
          texts={embedDisclaimerProps.texts}
        />
      )}
      <div className={cn(styles.root, { [styles.hidden]: !isVisible })}>
        <FocusableBox
          component="button"
          data-testid="chatbot"
          tabIndex={0}
          className={cn(styles.message, pushUp && styles.messagePushUp)}
          onClick={() => {
            if (!embedDisclaimerProps || hasButtonBeenClicked.current) {
              onClick?.()
              return
            }

            const itemValue = localStorage.getItem(
              embedDisclaimerProps.localStorageKey,
            )
            if (itemValue === 'true') {
              onClick?.()
              return
            }

            setIsConfirmModalOpen(true)
          }}
        >
          <Box position="relative">
            <Box>
              <Box style={{ visibility: loading ? 'hidden' : 'visible' }}>
                <Text variant="h5" color="white">
                  {text}
                </Text>
              </Box>
              {loading && (
                <Box className={styles.loadingDots}>
                  <LoadingDots color="white" />
                </Box>
              )}
            </Box>
          </Box>
          <div className={styles.messageArrow} />
          <div className={styles.messageArrowBorder} />
        </FocusableBox>
      </div>
    </>
  )
}

export default ChatBubble
