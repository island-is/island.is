import React, { AllHTMLAttributes, forwardRef, ReactNode } from 'react'
import { Button as ReaButton } from 'reakit/Button'
import cn from 'classnames'

import { Box } from '../Box/Box'
import * as styles from './Button.treat'
import { Icon } from '../IconRC/Icon'
import { Icon as IconType, Type } from '../IconRC/iconMap'

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
  icon?: IconType
  iconType?: Type
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps & Variants>(
  (
    {
      variant = 'primary',
      colorScheme = 'default',
      size = 'default',
      icon,
      iconType = 'filled',
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
        {icon && <ButtonIcon icon={icon} type={iconType} />}
      </Box>
    )
  },
)

type ButtonIconProps = {
  icon: ButtonProps['icon']
  type: ButtonProps['iconType']
}

const ButtonIcon = ({ icon, type }: ButtonIconProps) => (
  <Icon
    icon={icon!}
    type={type!}
    color="currentColor"
    className={styles.icon}
  />
)
