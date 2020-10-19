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
  | {
      variant?: 'utility'
      colorScheme?: keyof typeof styles.colors.utility
      circle?: never
    }
export interface ButtonProps {
  id?: NativeButtonProps['id']
  onClick?: NativeButtonProps['onClick']
  onFocus?: NativeButtonProps['onFocus']
  onBlur?: NativeButtonProps['onBlur']
  children?: ReactNode
  size?: Exclude<keyof typeof styles.size, 'utility'>
  disabled?: boolean
  focusable?: boolean
  icon?: IconTypes
  type?: NativeButtonProps['type']
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
      type = 'button',
      ...buttonProps
    },
    ref,
  ) => {
    return (
      <Box
        component={ReaButton}
        as={variant === 'text' ? 'span' : 'button'}
        ref={ref}
        type={type}
        className={cn(
          styles.variants[variant],
          styles.colors[variant][colorScheme],
          {
            [styles.size[size]]: variant !== 'utility' && !circle,
            [styles.size.utility]: variant === 'utility',
            [styles.circleSizes[size]]: circle,
            [styles.circle]: circle,
            [styles.padding[size]]:
              variant !== 'utility' && variant !== 'text' && !circle,
            [styles.padding.text]: variant === 'text',
            [styles.padding.utility]: variant === 'utility',
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
    type={icon!}
    width="none"
    height="none"
    color="currentColor"
    className={styles.icon}
  />
)
