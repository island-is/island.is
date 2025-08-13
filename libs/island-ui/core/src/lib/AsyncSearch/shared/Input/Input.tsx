import * as styles from './Input.css'

import React, { InputHTMLAttributes, forwardRef } from 'react'

import { AsyncSearchSizes } from '../../AsyncSearch'
import cn from 'classnames'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isOpen?: boolean
  colored?: boolean
  hasLabel?: boolean
  color?: 'white' | 'blueberry' | 'dark' | 'blue'
  inputSize: AsyncSearchSizes
  hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { isOpen, colored, hasLabel, inputSize, hasError, color, ...props },
    ref,
  ) => {
    return (
      <input
        spellCheck={false}
        {...props}
        className={cn(styles.input, styles.sizes[inputSize], {
          [styles.hasError]: hasError,
          [styles.open]: isOpen,
          [styles.colored]: colored,
          [styles.hasLabel]: hasLabel,
          [styles.white]: color === 'white',
          [styles.blueberry]: color === 'blueberry',
          [styles.dark]: color === 'dark',
          [styles.blue]: color === 'blue',
        })}
        ref={ref}
      />
    )
  },
)
