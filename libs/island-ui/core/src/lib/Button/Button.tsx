import React, { FC } from 'react'
import cn from 'classnames'

import * as styles from './Button.treat'

export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonVariant = 'normal' | 'ghost' | 'text'
export type ButtonWidth = 'normal' | 'fluid'

/* eslint-disable-next-line */
export interface ButtonProps {
  disabled?: boolean
  onClick?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  width?: ButtonWidth
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  variant = 'normal',
  size = 'medium',
  width = 'normal',
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        styles.button,
        styles.variants[variant],
        styles.sizes[size],
        styles.width[width],
      )}
    >
      {children}
    </button>
  )
}
