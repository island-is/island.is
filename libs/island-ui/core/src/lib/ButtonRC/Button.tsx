import React, { AllHTMLAttributes, forwardRef, ReactNode } from 'react'
import { Button as ReaButton } from 'reakit/Button'
import cn from 'classnames'

import { Box } from '../Box/Box'
import * as styles from './Button.treat'
import { Icon, IconTypes } from '../Icon/Icon'

// TODO: refine types, ex. if circle is true there should be no children. and filter variants with conditional types

type NativeButtonProps = AllHTMLAttributes<HTMLButtonElement>
type Variants =
  | {
      variant?: 'primary'
      colorScheme?: keyof typeof styles.colors.primary
      circle?: boolean
    }
  | {
      variant?: 'ghost'
      colorScheme?: keyof typeof styles.colors.ghost
      circle?: boolean
    }
  | {
      variant?: 'text'
      colorScheme?: keyof typeof styles.colors.text
      circle?: never
    }
export interface ButtonProps {
  id?: NativeButtonProps['id']
  onClick?: NativeButtonProps['onClick']
  onFocus?: NativeButtonProps['onFocus']
  onBlur?: NativeButtonProps['onBlur']
  children?: ReactNode
  size?: keyof typeof styles.size
  disabled?: boolean
  focusable?: boolean
  icon?: IconTypes
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps & Variants>(
  (
    {
      variant = 'primary',
      colorScheme = 'default',
      size = 'default',
      icon,
      children,
      circle,
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
          {
            [styles.size[size]]: !circle,
            [styles.circleSizes[size]]: circle,
            [styles.circle]: circle,
            [styles.padding[size]]: variant !== 'text' && !circle,
            [styles.padding.text]: variant === 'text',
          },
        )}
        {...buttonProps}
      >
        {children}
        {icon && <ButtonIcon icon={icon} />}
      </Box>
    )
  },
)

type ButtonIconProps = {
  icon: ButtonProps['icon']
}

const ButtonIcon = ({ icon }: ButtonIconProps) => (
  <Icon
    type={icon}
    width="none"
    height="none"
    color="currentColor"
    className={styles.icon}
  />
)
