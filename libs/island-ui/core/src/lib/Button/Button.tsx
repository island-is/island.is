import React, { forwardRef, ReactNode } from 'react'
import cn from 'classnames'
import { Icon as IconComponent, IconTypes, Box } from '../..'

import * as styles from './Button.treat'

export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonVariant = 'normal' | 'ghost' | 'text'
export type ButtonWidth = 'normal' | 'fluid'

export interface ButtonProps {
  disabled?: boolean
  onClick?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  width?: ButtonWidth
  href?: string
  htmlType?: 'button' | 'submit'
  icon?: IconTypes
  children: ReactNode
  loading?: boolean
}

const isLinkExternal = (href: string): boolean => href.indexOf('://') > 0

export const Button = forwardRef<
  HTMLAnchorElement & HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children,
      onClick,
      disabled,
      htmlType = 'button',
      variant = 'normal',
      size = 'medium',
      width = 'normal',
      href,
      icon,
      loading,
    },
    ref,
  ) => {
    const className = cn(
      styles.button,
      styles.variants[variant],
      styles.sizes[size],
      styles.width[width],
    )

    const isExternal = href && isLinkExternal(href)

    const anchorProps = {
      ...(isExternal && { rel: 'noreferrer noopener' }),
    }

    const showIcon = icon || isExternal || loading

    const Icon = () => {
      if (!showIcon) {
        return null
      }

      let type = icon

      if (loading) {
        type = 'loading'
      } else if (isExternal) {
        type = 'external'
      }

      const iconProps = {
        spin: loading,
        width: 15,
        type,
      }

      return (
        <IconContainer>
          <IconComponent {...iconProps} />
        </IconContainer>
      )
    }

    const sharedProps = {
      className,
    }

    return href ? (
      <a href={href} role="button" {...anchorProps} {...sharedProps}>
        {children}
        <Icon />
      </a>
    ) : (
      <button
        ref={ref}
        type={htmlType}
        disabled={disabled}
        onClick={onClick}
        {...sharedProps}
      >
        {children}
        <Icon />
      </button>
    )
  },
)

const IconContainer = ({ children }) => (
  <Box display="flex" height="full" alignItems="center" paddingLeft={2}>
    {children}
  </Box>
)
