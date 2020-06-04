import React, { FC, forwardRef, ReactNode } from 'react'
import cn from 'classnames'
import { Icon, Box } from '../..'

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
  href?: string
  htmlType?: 'button' | 'submit'
  children: ReactNode
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
    },
    ref,
  ) => {
    const className = cn(
      styles.button,
      styles.variants[variant],
      styles.sizes[size],
      styles.width[width],
    )

    const isExternal = isLinkExternal(href)

    const anchorProps = {
      ...(isExternal && { rel: 'noreferrer noopener' }),
    }

    return href ? (
      <a href={href} role="button" className={className} {...anchorProps}>
        {children}
        {isExternal && (
          <IconContainer>
            <Icon type="external" color="white" />
          </IconContainer>
        )}
      </a>
    ) : (
      <button
        ref={ref}
        type={htmlType}
        disabled={disabled}
        onClick={onClick}
        className={className}
      >
        {children}
      </button>
    )
  },
)

const IconContainer: FC = ({ children }) => (
  <Box paddingLeft={2}>{children}</Box>
)
