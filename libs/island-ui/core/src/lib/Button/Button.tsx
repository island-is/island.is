import React, { forwardRef, ReactNode } from 'react'
import cn from 'classnames'
import { Icon as IconComponent, IconTypes, Box, Inline } from '../..'

import * as styles from './Button.treat'

export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonVariant = 'normal' | 'ghost' | 'text' | 'menu'
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
  children?: ReactNode
  loading?: boolean
  leftIcon?: IconTypes
  leftImage?: string
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
      leftImage,
      leftIcon,
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
    const isMenuButton = variant === 'menu'
    const hasLeftContent = leftImage || leftIcon
    const showRightIcon = icon || isExternal || loading

    const anchorProps = {
      ...(isExternal && { rel: 'noreferrer noopener' }),
    }

    const Icon = () => {
      if (!showRightIcon) {
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

    const ButtonContent = () => {
      const LeftImage = () =>
        leftImage && (
          <div
            style={{
              backgroundImage: `url(${leftImage})`,
            }}
            className={styles.image}
          />
        )

      const LeftIcon = () => leftIcon && <IconComponent type={leftIcon} />

      return (
        <Inline alignY="center" space={2}>
          {isMenuButton && hasLeftContent ? (
            <LeftContentContainer>
              {leftImage ? <LeftImage /> : <LeftIcon />}
            </LeftContentContainer>
          ) : null}
          {children ? children : null}
          {icon ? <Icon /> : null}
        </Inline>
      )
    }

    const sharedProps = {
      className,
    }

    return href ? (
      <a href={href} role="button" {...anchorProps} {...sharedProps}>
        <ButtonContent />
      </a>
    ) : (
      <button
        ref={ref}
        type={htmlType}
        disabled={disabled}
        onClick={onClick}
        {...sharedProps}
      >
        <ButtonContent />
      </button>
    )
  },
)

const IconContainer = ({ children }) => (
  <Box display="flex" height="full" alignItems="center">
    {children}
  </Box>
)

const LeftContentContainer = ({ children }) => {
  return (
    <>
      <Box display="inlineBlock" className={styles.leftSpacer} />
      <Box
        position="absolute"
        display="flex"
        left={0}
        top={0}
        bottom={0}
        alignItems="center"
        justifyContent="center"
        background="blue100"
        className={styles.leftContentContainer}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="circle"
          overflow="hidden"
          className={styles.leftContent}
        >
          {children}
        </Box>
      </Box>
    </>
  )
}
