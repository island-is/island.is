import React from 'react'
import { Icon, Text } from '@island.is/island-ui/core'
import * as styles from './HideableText.treat'

interface Props {
  text: string
  onToggleVisibility: () => void
  tooltip?: string
}

const HideableText: React.FC<Props> = (props) => {
  const { text, onToggleVisibility, tooltip } = props

  return (
    <>
      <div className={styles.hideableTextContainer}>
        <Text>{text}</Text>
        <button onClick={onToggleVisibility}>
          <Icon icon="eye" type="outline" color="dark300" />
        </button>
      </div>
    </>
  )
}

export default HideableText
