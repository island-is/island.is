import React, { FC, forwardRef, ReactNode } from 'react'
import cn from 'classnames'

import { Text } from '../Text/Text'
import { Hyphen } from '../Hyphen/Hyphen'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'

import * as styles from './Tag.css'

export type TagVariant =
  | 'blue'
  | 'darkerBlue'
  | 'purple'
  | 'white'
  | 'red'
  | 'rose'
  | 'blueberry'
  | 'dark'
  | 'mint'
  | 'disabled'

export interface TagProps {
  onClick?: () => void
  variant?: TagVariant
  href?: string
  id?: string
  active?: boolean
  disabled?: boolean
  outlined?: boolean
  /** Renders a red dot driving attention to the tag. */
  attention?: boolean
  children: string | ReactNode
  truncate?: boolean
  hyphenate?: boolean
  textLeft?: boolean
  CustomLink?: FC
}

export const Tag = forwardRef<HTMLButtonElement & HTMLAnchorElement, TagProps>(
  (
    {
      children,
      href,
      onClick,
      variant = 'blue',
      active,
      disabled,
      outlined,
      attention,
      truncate,
      hyphenate,
      textLeft,
      CustomLink,
      ...props
    }: TagProps,
    ref,
  ) => {
    const className = cn(styles.container, styles.variants[variant], {
      [styles.active]: active,
      [styles.outlined]: outlined,
      [styles.attention]: attention,
      [styles.focusable]: !disabled,
      [styles.truncate]: truncate,
      [styles.hyphenate]: hyphenate,
      [styles.textLeft]: textLeft,
    })

    const isExternal = href && shouldLinkOpenInNewWindow(href)

    const anchorProps = {
      ...(isExternal && { rel: 'noreferrer noopener' }),
    }

    const sharedProps = {
      className,
      ref,
    }

    const hyphenated = hyphenate && typeof children === 'string' && (
      <Hyphen>{children}</Hyphen>
    )

    const content = (
      <Text variant="eyebrow" as="span" truncate={truncate}>
        {!truncate && hyphenate ? hyphenated : children}
      </Text>
    )

    if (disabled) {
      return <span {...sharedProps}>{content}</span>
    }

    if (CustomLink) {
      return <CustomLink {...sharedProps}>{content}</CustomLink>
    }

    return href ? (
      <a href={href} {...anchorProps} {...sharedProps} {...props}>
        {content}
      </a>
    ) : (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        {...sharedProps}
        {...props}
      >
        {content}
      </button>
    )
  },
)
