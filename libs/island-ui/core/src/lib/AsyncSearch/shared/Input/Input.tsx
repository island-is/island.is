import React, { forwardRef } from 'react'
import cn from 'classnames'
import * as styles from './Input.treat'

import { AsyncSearchSizes } from '../../AsyncSearch'

interface InputProps {
  isOpen?: boolean
  colored?: boolean
  hasLabel?: boolean
  placeholder?: string
  size: AsyncSearchSizes
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isOpen, colored, hasLabel, size, ...props }, ref) => {
    return (
      <input
        {...props}
        spellCheck={false}
        className={cn(styles.input, styles.sizes[size], {
          [styles.open]: isOpen,
          [styles.colored]: colored,
          [styles.hasLabel]: hasLabel,
        })}
        ref={ref}
      />
    )
  },
)

export default Input
