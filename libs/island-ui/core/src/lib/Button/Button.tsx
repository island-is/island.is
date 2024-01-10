import * as React from 'react'
import { forwardRef } from 'react'
import { Button as ReaButton } from 'reakit/Button'
import cn from 'classnames'
import { Box } from '../Box/Box'
import * as styles from './Button.css'
import { Icon } from '../IconRC/Icon'
import { TestSupport } from '@island.is/island-ui/utils'
import { ButtonProps, ButtonTypes } from './types'

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonTypes & TestSupport
>(
  (
    {
      variant = 'primary',
      colorScheme = 'default',
      size = 'default',
      icon,
      iconType = 'filled',
      preTextIcon,
      preTextIconType = 'filled',
      children,
      circle,
      type = 'button',
      fluid,
      disabled,
      loading,
      nowrap,
      inline,
      as,
      truncate,
      unfocusable,
      value,
      name,
      ...buttonProps
    },
    ref,
  ) => {
    return (
      <Box
        component={ReaButton}
        as={as ? (as as string) : variant === 'text' ? 'span' : 'button'}
        ref={ref}
        value={value}
        name={name}
        type={as === 'span' ? undefined : type}
        className={cn(
          styles.variants[variant],
          (styles.colors[variant] as Record<string, string>)[colorScheme],
          {
            [styles.truncate]: truncate,
            [styles.size[size]]:
              variant !== 'utility' &&
              !circle &&
              !(variant === 'text' && size === 'small'),
            [styles.fluid]: fluid,
            [styles.nowrap]: nowrap,
            [styles.size.utility]: variant === 'utility',
            [styles.size.textSmall]: variant === 'text' && size === 'small',
            [styles.circleSizes[size]]: circle,
            [styles.circle]: circle,
            [styles.padding[size]]:
              variant !== 'utility' && variant !== 'text' && !circle,
            [styles.padding.text]: variant === 'text',
            [styles.padding.utility]: variant === 'utility',
            [styles.isEmpty]: !children,
            [styles.loading]: loading,
          },
        )}
        display={variant === 'text' ? 'inline' : inline ? 'inlineFlex' : 'flex'}
        disabled={disabled || loading}
        {...(unfocusable && { tabIndex: -1 })}
        {...buttonProps}
      >
        {loading && variant !== 'text' ? (
          <>
            {preTextIcon && (
              <ButtonIcon
                icon={preTextIcon}
                type={preTextIconType}
                transparent
                preText
              />
            )}
            <span className={styles.hideContent}>{children}</span>
            {icon && <ButtonIcon icon={icon} type={iconType} transparent />}
            <div
              className={cn(styles.loader, { [styles.loadingCircle]: circle })}
            >
              <div className={styles.loadingDot} />
              <div className={styles.loadingDot} />
              <div className={styles.loadingDot} />
            </div>
          </>
        ) : (
          <>
            {preTextIcon && (
              <ButtonIcon icon={preTextIcon} type={preTextIconType} preText />
            )}
            {children}
            {icon && <ButtonIcon icon={icon} type={iconType} />}
          </>
        )}
      </Box>
    )
  },
)

type ButtonIconProps = {
  icon: ButtonProps['icon']
  type: ButtonProps['iconType']
  transparent?: boolean
  preText?: boolean
}

const ButtonIcon = ({ icon, type, transparent, preText }: ButtonIconProps) => (
  <Icon
    icon={icon!}
    type={type!}
    color={transparent ? 'transparent' : 'currentColor'}
    className={cn(
      styles.icon,
      preText ? styles.iconPreText : styles.iconPostText,
    )}
    skipPlaceholderSize
  />
)
