import React, { FC } from 'react'
import cn from 'classnames'

import * as styles from './Button.treat'

export type ButtonSize = 'normal' | 'large'
export type ButtonVariant = 'default' | 'ghost' | 'text'

/* eslint-disable-next-line */
export interface ButtonProps {
  disabled?: boolean
  onClick?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  variant = 'default',
  size = 'normal',
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        styles.button,
        styles.variants[variant],
        styles.sizes[size],
      )}
    >
      {children}
    </button>
  )
}
