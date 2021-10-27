import React from 'react'
import cn from 'classnames'
import * as styles from './BlueBox.css'

interface Props {
  size?: 'small' | 'large'
  justifyContent?: 'center'

  /**
   * Set explicit height
   */
  height?: number
}

const BlueBox: React.FC<Props> = (props) => {
  const { children, size = 'large', justifyContent, height } = props

  return (
    <div
      className={cn(styles.BlueBoxContainer, {
        [styles.small]: size === 'small',
        [styles.center]: justifyContent === 'center',
      })}
      style={{ height: height }}
    >
      {children}
    </div>
  )
}

export default BlueBox
