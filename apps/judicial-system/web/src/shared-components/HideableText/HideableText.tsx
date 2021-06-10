import React, { useState } from 'react'
import { Icon, Text } from '@island.is/island-ui/core'
import * as styles from './HideableText.treat'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  text: string
  onToggleVisibility: () => void
  tooltip?: string
}

const HideableText: React.FC<Props> = (props) => {
  const [isHidden, setIsHidden] = useState<boolean>(false)
  const { text, onToggleVisibility, tooltip } = props

  return (
    <>
      <div className={styles.hideableTextContainer}>
        <Text strikethrough={isHidden} color={isHidden ? 'dark300' : 'dark400'}>
          {text}
        </Text>
        <button
          className={styles.eyeButton}
          onClick={() => {
            setIsHidden(!isHidden)
            onToggleVisibility()
          }}
        >
          <AnimatePresence>
            {isHidden && (
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
            color={isHidden ? 'dark300' : 'blue400'}
          />
        </button>
      </div>
    </>
  )
}

export default HideableText
