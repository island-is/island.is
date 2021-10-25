import React from 'react'
import cn from 'classnames'
import * as styles from './BlueBox.css'

interface Props {
  size?: 'small' | 'large'

  /**
   * Set explicit height
   */
  height?: number
}

const BlueBox: React.FC<Props> = (props) => {
  const { children, size = 'large', height } = props

  return (
    <div
      className={cn(styles.BlueBoxContainer, {
        [styles.small]: size === 'small',
      })}
      style={{ height: height }}
    >
      {children}
    </div>
  )
}

export default BlueBox
