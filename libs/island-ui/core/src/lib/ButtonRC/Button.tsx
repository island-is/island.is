import React, { AllHTMLAttributes, forwardRef, ReactNode } from 'react'
import { Button as ReaButton } from 'reakit/Button'
import cn from 'classnames'
import { Box } from '../Box'

import * as styles from './Button.treat'

type NativeButtonProps = AllHTMLAttributes<HTMLButtonElement>
export interface ButtonProps {
  id?: NativeButtonProps['id']
  onClick?: NativeButtonProps['onClick']
  children?: ReactNode
  variant?: keyof typeof styles.variants
  colorScheme?: keyof typeof styles.colors.primary
  size?: keyof typeof styles.size
  disabled?: boolean
  focusable?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      colorScheme = 'default',
      size = 'default',
      children,
      ...buttonProps
    },
    ref,
  ) => {
    return (
      <Box
        component={ReaButton}
        as={variant === 'text' ? 'span' : 'button'}
        ref={ref}
        className={cn(
          styles.variants[variant],
          styles.colors[variant][colorScheme],
          styles.size[size],
          {
            [styles.padding[size]]: variant !== 'text',
            [styles.padding.text]: variant === 'text',
          },
        )}
        {...buttonProps}
      >
        {children}
      </Box>
    )
  },
)
