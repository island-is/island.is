import React from 'react'
import cn from 'classnames'

import { TestSupport } from '@island.is/island-ui/utils'

import * as styles from './BlueBox.css'

interface Props {
  size?: 'small' | 'large'
  justifyContent?: 'center'

  /**
   * Set explicit height
   */
  height?: number
  dataTestId?: string
}

const BlueBox: React.FC<React.PropsWithChildren<Props & TestSupport>> = (
  props,
) => {
  const { children, size = 'large', justifyContent, height, dataTestId } = props

  return (
    <div
      className={cn(styles.BlueBoxContainer, {
        [styles.small]: size === 'small',
        [styles.center]: justifyContent === 'center',
      })}
      style={{ height: height }}
      data-testid={dataTestId}
    >
      {children}
    </div>
  )
}

export default BlueBox
