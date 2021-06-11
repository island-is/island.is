import React, { useState } from 'react'
import { Icon, Text, Tooltip } from '@island.is/island-ui/core'
import * as styles from './HideableText.treat'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  text: string
  onToggleVisibility: (isVisible: boolean) => void
  defaultIsVisible?: boolean
  tooltip?: string
}

const HideableText: React.FC<Props> = (props) => {
  const { text, onToggleVisibility, tooltip, defaultIsVisible } = props
  const [isVisible, setIsVisible] = useState<boolean>(defaultIsVisible || false)

  const renderVisibilityButton = () => (
    <button
      className={styles.eyeButton}
      onClick={() => {
        setIsVisible(!isVisible)
        onToggleVisibility(!isVisible)
      }}
    >
      <AnimatePresence>
        {!isVisible && (
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: 30 }}
            exit={{ width: 0 }}
            className={styles.eyeStrikethrough}
          />
        )}
      </AnimatePresence>
      <Icon
        icon="eye"
        type="outline"
        color={isVisible ? 'blue400' : 'dark300'}
      />
    </button>
  )

  return (
    <>
      <div className={styles.hideableTextContainer}>
        <Text
          strikethrough={!isVisible}
          color={isVisible ? 'dark400' : 'dark300'}
        >
          {text}
        </Text>
        {tooltip ? (
          <Tooltip text={tooltip} placement="right">
            {renderVisibilityButton()}
          </Tooltip>
        ) : (
          renderVisibilityButton()
        )}
      </div>
    </>
  )
}

export default HideableText
