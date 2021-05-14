import React from 'react'
import cn from 'classnames'
import * as styles from './BlueBox.treat'

interface Props {
  size?: 'small' | 'large'

  /**
   * Set explicit height
   */
  height?: number
}

const BlueBox: React.FC<Props> = (props) => {
  const { children, size = 'large', height } = props
  console.log(height)
  return (
    <div
      className={cn(
        styles.BlueBoxContainer,
        { height: height },
        {
          [styles.small]: size === 'small',
        },
      )}
      style={{ height: height }}
    >
      {children}
    </div>
  )
}

export default BlueBox
