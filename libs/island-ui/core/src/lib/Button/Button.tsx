import React, { forwardRef, ReactNode } from 'react'
import cn from 'classnames'
import { Box } from '../Box'
import { Inline } from '../Inline/Inline'
import { IconTypes, Icon as IconComponent } from '../Icon/Icon'

import * as styles from './Button.treat'

export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonVariant = 'normal' | 'ghost' | 'text' | 'menu'
export type ButtonWidth = 'normal' | 'fluid' | 'fixed'

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
  noWrap?: boolean
  target?: string
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
      noWrap,
      target = '_blank',
    },
    ref,
  ) => {
    const className = cn(
      styles.button,
      styles.variants[variant],
      styles.sizes[size],
      styles.width[width],
      {
        [styles.noWrap]: noWrap,
      },
    )

    const isExternal = href && isLinkExternal(href)
    const isMenuButton = variant === 'menu'
    const hasLeftContent = leftImage || leftIcon
    const showRightIcon = icon || isExternal || loading

    const anchorProps = {
      ...(isExternal && { rel: 'noreferrer noopener', target }),
    }

    const sharedProps = {
      className,
    }

    const buttonContent = {
      leftImage,
      isMenuButton,
      hasLeftContent,
      children,
      icon,
      leftIcon,
      showRightIcon,
      loading,
      isExternal,
    }

    return href ? (
      <a href={href} role="button" {...anchorProps} {...sharedProps}>
        <ButtonContent {...buttonContent} />
      </a>
    ) : (
      <button
        ref={ref}
        type={htmlType}
        disabled={disabled}
        onClick={onClick}
        {...sharedProps}
      >
        <ButtonContent {...buttonContent} />
      </button>
    )
  },
)

const Icon = ({ showRightIcon, icon, loading, isExternal }) => {
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

const LeftImage = ({ leftImage }) =>
  leftImage && (
    <div
      style={{
        backgroundImage: `url(${leftImage})`,
      }}
      className={styles.image}
    />
  )

const LeftIcon = ({ leftIcon }) => leftIcon && <IconComponent type={leftIcon} />

const ButtonContent = ({
  leftImage,
  isMenuButton,
  hasLeftContent,
  children,
  icon,
  leftIcon,
  showRightIcon,
  loading,
  isExternal,
}) => {
  return (
    <Inline alignY="center" space={2}>
      {isMenuButton && hasLeftContent ? (
        <LeftContentContainer>
          {leftImage ? (
            <LeftImage leftImage={leftImage} />
          ) : (
            <LeftIcon leftIcon={leftIcon} />
          )}
        </LeftContentContainer>
      ) : leftIcon ? (
        <LeftIcon leftIcon={leftIcon} />
      ) : null}
      {children ? children : null}
      {icon ? (
        <Icon
          showRightIcon={showRightIcon}
          icon={icon}
          loading={loading}
          isExternal={isExternal}
        />
      ) : null}
    </Inline>
  )
}

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
