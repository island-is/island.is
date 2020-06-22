import React from 'react'
import cn from 'classnames'
import * as styles from './Input.treat'

export const Input = ({ isOpen, colored, hasLabel, size, ...props }) => {
  return (
    <input
      {...props}
      spellCheck={false}
      className={cn(styles.input, styles.sizes[size], {
        [styles.open]: isOpen,
        [styles.colored]: colored,
        [styles.hasLabel]: hasLabel,
      })}
    />
  )
}

export default Input
