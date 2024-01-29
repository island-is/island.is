import React from 'react'
import cn from 'classnames'

import { Box, FocusableBox, LoadingDots, Text } from '@island.is/island-ui/core'

import * as styles from './ChatBubble.css'

interface ChatBubbleProps {
  text: string
  pushUp?: boolean
  isVisible?: boolean
  onClick?: () => void
  loading?: boolean
}

export const ChatBubble = ({
  text,
  isVisible = true,
  onClick,
  pushUp = false,
  loading = false,
}: ChatBubbleProps) => {
  return (
    <div className={cn(styles.root, { [styles.hidden]: !isVisible })}>
      <FocusableBox
        component="button"
        data-testid="chatbot"
        tabIndex={0}
        className={cn(styles.message, pushUp && styles.messagePushUp)}
        onClick={onClick}
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
  )
}

export default ChatBubble
