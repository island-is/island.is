/** @deprecated ButtonDeprecated has been deprecated in favor of Button */
import React, { forwardRef, ReactNode, FC, useContext } from 'react'
import cn from 'classnames'
import { Box } from '../Box/Box'
import { Inline } from '../Inline/Inline'
import { IconTypes, Icon as IconComponent } from '../Icon/Icon'
import { ColorSchemeContext } from '../context'

import * as styles from './Button.css'
import { useDeprecatedComponent } from '../private/useDeprecatedComponent'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'

export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonVariant = 'normal' | 'ghost' | 'redGhost' | 'text' | 'menu'

export type ButtonWidth = 'normal' | 'fluid' | 'fixed'

export interface ButtonProps {
  disabled?: boolean
  onClick?:
    | ((
        event: React.MouseEvent<
          HTMLButtonElement | HTMLAnchorElement,
          MouseEvent
        >,
      ) => void)
    | undefined
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
  white?: boolean
  tabIndex?: number
  rounded?: boolean
  id?: string
}

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
      white,
      tabIndex,
      rounded = false,
      ...rest
    },
    ref,
  ) => {
    useDeprecatedComponent('ButtonDeprecated', 'Button')
    const { colorScheme } = useContext(ColorSchemeContext)

    const className = cn(
      styles.button,
      styles.variants[variant],
      styles.sizes[size],
      styles.width[width],
      {
        [styles.noWrap]: noWrap,
        [styles.white]: colorScheme === 'white' || white,
        [styles.rounded]: rounded,
      },
    )

    icon = loading ? 'loading' : icon
    const isExternal = !!(href && shouldLinkOpenInNewWindow(href))
    const isMenuButton = variant === 'menu'
    const hasLeftContent = !!(leftImage || leftIcon)
    const showRightIcon = !!(icon || isExternal || loading)

    const anchorProps = {
      ...(isExternal && { rel: 'noreferrer noopener', target }),
    }

    const sharedProps = {
      tabIndex,
      className,
      onClick,
      ...rest,
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
      variant,
    }

    return href ? (
      <a ref={ref} href={href} role="button" {...anchorProps} {...sharedProps}>
        <ButtonContent {...buttonContent} />
      </a>
    ) : (
      <button ref={ref} type={htmlType} disabled={disabled} {...sharedProps}>
        <ButtonContent {...buttonContent} />
      </button>
    )
  },
)

const Icon = ({
  showRightIcon,
  icon,
  loading,
  isExternal,
}: {
  showRightIcon: boolean
  icon: IconTypes
  loading: boolean
  isExternal: boolean
}) => {
  if (!showRightIcon) {
    return null
  }

  const type = loading ? 'loading' : isExternal ? 'external' : icon

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

const LeftImage = ({ leftImage }: { leftImage: string }) =>
  leftImage ? (
    <div
      style={{
        backgroundImage: `url(${leftImage})`,
      }}
      className={styles.image}
    />
  ) : null

const LeftIcon = ({ leftIcon }: { leftIcon: IconTypes }) =>
  leftIcon ? <IconComponent type={leftIcon} /> : null

interface ButtonContentProps {
  leftImage?: string
  isMenuButton: boolean
  hasLeftContent: boolean
  icon?: IconTypes
  leftIcon?: IconTypes
  showRightIcon: boolean
  loading?: boolean
  isExternal?: boolean
  variant?: ButtonVariant
}

const ButtonContent: FC<React.PropsWithChildren<ButtonContentProps>> = ({
  leftImage,
  isMenuButton,
  hasLeftContent,
  children,
  icon,
  leftIcon,
  showRightIcon,
  loading,
  isExternal,
  variant = '',
}) => {
  return (
    <>
      {variant === 'text' ? (
        <span>
          {children ? (
            <span>
              {children}
              <span
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                {icon ? (
                  <>
                    &nbsp;&nbsp;
                    <Icon
                      showRightIcon={showRightIcon}
                      icon={icon}
                      loading={!!loading}
                      isExternal={!!isExternal}
                    />
                  </>
                ) : null}
              </span>
            </span>
          ) : (
            <>
              {icon ? (
                <Icon
                  showRightIcon={showRightIcon}
                  icon={icon}
                  loading={!!loading}
                  isExternal={!!isExternal}
                />
              ) : null}
            </>
          )}
        </span>
      ) : (
        <Inline alignY="center" flexWrap="nowrap" space={2}>
          {isMenuButton && hasLeftContent ? (
            <LeftContentContainer>
              {leftImage ? (
                <LeftImage leftImage={leftImage} />
              ) : leftIcon ? (
                <LeftIcon leftIcon={leftIcon} />
              ) : null}
            </LeftContentContainer>
          ) : leftIcon ? (
            <LeftIcon leftIcon={leftIcon} />
          ) : null}
          {children ? (
            <span>
              {children}
              <span
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                {icon ? (
                  <>
                    &nbsp;&nbsp;
                    <Icon
                      showRightIcon={showRightIcon}
                      icon={icon}
                      loading={!!loading}
                      isExternal={!!isExternal}
                    />
                  </>
                ) : null}
              </span>
            </span>
          ) : (
            <>
              {icon ? (
                <Icon
                  showRightIcon={showRightIcon}
                  icon={icon}
                  loading={!!loading}
                  isExternal={!!isExternal}
                />
              ) : null}
            </>
          )}
        </Inline>
      )}
    </>
  )
}

const IconContainer: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <Box
    display="inlineBlock"
    textAlign="center"
    height="full"
    alignItems="center"
    style={{
      verticalAlign: 'middle',
    }}
  >
    {children}
  </Box>
)

const LeftContentContainer: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
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

export { Button as ButtonDeprecated }
