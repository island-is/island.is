import React, { forwardRef, InputHTMLAttributes } from 'react'
import cn from 'classnames'
import * as styles from './Input.css'

import { AsyncSearchSizes } from '../../AsyncSearch'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isOpen?: boolean
  colored?: boolean
  hasLabel?: boolean
  color?: 'white' | 'blueberry'
  inputSize: AsyncSearchSizes
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isOpen, colored, hasLabel, inputSize, color, ...props }, ref) => {
    return (
      <input
        spellCheck={false}
        {...props}
        className={cn(styles.input, styles.sizes[inputSize], {
          [styles.open]: isOpen,
          [styles.colored]: colored,
          [styles.hasLabel]: hasLabel,
          [styles.white]: color === 'white',
          [styles.blueberry]: color === 'blueberry',
        })}
        ref={ref}
      />
    )
  },
)
