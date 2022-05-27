import React from 'react'
import cn from 'classnames'
import { FocusableBox, Text } from '@island.is/island-ui/core'
import * as styles from './ChatBubble.css'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { theme } from '@island.is/island-ui/theme'

interface ChatBubbleProps {
  text: string
  pushUp?: boolean
  isVisible?: boolean
  onClick?: () => void
}

export const ChatBubble = ({
  text,
  isVisible = true,
  onClick,
}: ChatBubbleProps) => {
  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  return (
    <div className={cn(styles.root, { [styles.hidden]: !isVisible })}>
      <FocusableBox
        component="button"
        tabIndex={0}
        className={cn(styles.message, isMobile && styles.messagePushUp)}
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
