import React, { FC, forwardRef, ReactNode } from 'react'
import cn from 'classnames'
import { Text } from '../Text/Text'

import * as styles from './Tag.treat'
import { Icon } from '../IconRC/Icon'

export type TagVariant =
  | 'blue'
  | 'darkerBlue'
  | 'purple'
  | 'white'
  | 'red'
  | 'rose'
  | 'blueberry'
  | 'dark'

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
  CustomLink?: FC
  /** Renders a small "x" icon to indicate that invoking the
   * `onClick` handler will (likely) remove/delete  the tag.
   *
   * Only appears on `<button>`s with an `onClick` handler defined
   */
  removable?: boolean
}

const isLinkExternal = (href: string): boolean => href.indexOf('://') > 0

export const Tag = forwardRef<HTMLButtonElement & HTMLAnchorElement, TagProps>(
  (
    {
      children,
      href,
      onClick,
      removable,
      variant = 'blue',
      active,
      disabled,
      outlined,
      attention,
      truncate,
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
    })

    const isExternal = href && isLinkExternal(href)

    const anchorProps = {
      ...(isExternal && { rel: 'noreferrer noopener' }),
    }

    const sharedProps = {
      className,
      ref,
    }

    const renderCloseIcon = removable && !!onClick && !href

    const content = (
      <Text variant="eyebrow" as="span" truncate={truncate}>
        {children}
        {renderCloseIcon && <Icon icon="close" className={styles.closeIcon} />}
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
