import React from 'react'
import cn from 'classnames'
import { FocusableBox, Text } from '@island.is/island-ui/core'
import * as styles from './ChatBubble.css'

interface ChatBubbleProps {
  text: string
  pushUp?: boolean
  isVisible?: boolean
  onClick?: () => void
}

export const ChatBubble = ({
  text,
  pushUp = false,
  isVisible = true,
  onClick,
}: ChatBubbleProps) => {
  return (
    <div className={cn(styles.root, { [styles.hidden]: !isVisible })}>
      <FocusableBox
        component="button"
        tabIndex={0}
        className={cn(styles.message, pushUp && styles.messagePushUp)}
        onClick={onClick}
      >
        <Text variant="h5" color="white">
          {text}
        </Text>
        <div className={styles.messageArrow} />
        <div className={styles.messageArrowBorder} />
      </FocusableBox>
    </div>
  )
}

export default ChatBubble
