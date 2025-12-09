import React, { useCallback, useRef, useState } from 'react'
import cn from 'classnames'

import { Box, FocusableBox, LoadingDots, Text } from '@island.is/island-ui/core'

import {
  EmbedDisclaimer,
  type EmbedDisclaimerProps,
} from './EmbedDisclaimer/EmbedDisclaimer'
import { CircleIcon } from './CircleIcon'
import * as styles from './ChatBubble.css'

interface ChatBubbleProps {
  text: string
  pushUp?: boolean
  isVisible?: boolean
  onClick?: () => void
  loading?: boolean
  embedDisclaimerProps?: Pick<EmbedDisclaimerProps, 'localStorageKey' | 'texts'>
  variant?: 'default' | 'circle'
}

interface DefaultVariantProps {
  isVisible: boolean
  pushUp: boolean
  handleClick: () => void
  loading: boolean
  text: string
}

const DefaultVariant = ({
  isVisible,
  pushUp,
  handleClick,
  loading,
  text,
}: DefaultVariantProps) => {
  return (
    <div className={cn(styles.root, { [styles.hidden]: !isVisible })}>
      <FocusableBox
        component="button"
        data-testid="chatbot"
        tabIndex={0}
        className={cn(styles.message, pushUp && styles.messagePushUp)}
        onClick={handleClick}
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

interface CircleVariantProps {
  isVisible: boolean
  pushUp: boolean
  handleClick: () => void
  loading: boolean
  text: string
}

const CircleVariant = ({
  isVisible,
  pushUp,
  handleClick,
  loading,
  text,
}: CircleVariantProps) => {
  return (
    <div
      className={cn(
        styles.circleRoot,
        { [styles.hidden]: !isVisible },
        pushUp ? styles.circleRootPushUp : styles.circleRootNoPushUp,
      )}
      role="button"
      data-testid="chatbot"
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleClick()
          event.preventDefault()
        }
      }}
      aria-label={text}
      tabIndex={0}
    >
      <CircleIcon loading={loading} />
    </div>
  )
}

export const ChatBubble = ({
  text,
  isVisible = true,
  onClick,
  pushUp = false,
  loading = false,
  embedDisclaimerProps,
  variant = 'default',
}: ChatBubbleProps) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const hasButtonBeenClicked = useRef(false)

  const handleClick = useCallback(() => {
    if (!embedDisclaimerProps || hasButtonBeenClicked.current) {
      onClick?.()
      return
    }

    let itemValue: string | null = null
    try {
      itemValue = localStorage.getItem(embedDisclaimerProps.localStorageKey)
    } catch (error) {
      console.warn('Failed to get preference:', error)
    }

    if (itemValue === 'true') {
      onClick?.()
      return
    }

    setIsConfirmModalOpen(true)
  }, [embedDisclaimerProps, onClick])

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
      {variant === 'default' && (
        <DefaultVariant
          isVisible={isVisible}
          pushUp={pushUp}
          handleClick={handleClick}
          loading={loading}
          text={text}
        />
      )}
      {variant === 'circle' && (
        <CircleVariant
          isVisible={isVisible}
          pushUp={pushUp}
          handleClick={handleClick}
          loading={loading}
          text={text}
        />
      )}
    </>
  )
}

export default ChatBubble
