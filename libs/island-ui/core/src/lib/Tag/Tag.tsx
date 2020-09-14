import React, { forwardRef, ReactNode } from 'react'
import cn from 'classnames'
import { Typography } from '../Typography/Typography'

import * as styles from './Tag.treat'

export type TagVariant =
  | 'blue'
  | 'darkerBlue'
  | 'purple'
  | 'white'
  | 'red'
  | 'mint'
  | 'darkerMint'

export interface TagProps {
  onClick?: () => void
  variant?: TagVariant
  href?: string
  id?: string
  active?: boolean
  disabled?: boolean
  label?: boolean
  bordered?: boolean
  noBackgroundFill?: boolean
  children: string | ReactNode
}

const isLinkExternal = (href: string): boolean => href.indexOf('://') > 0

export const Tag = forwardRef<HTMLButtonElement & HTMLAnchorElement, TagProps>(
  (
    {
      children,
      href,
      onClick,
      variant = 'blue',
      active = false,
      disabled,
      label,
      bordered = false,
      noBackgroundFill = false,
      ...props
    }: TagProps,
    ref,
  ) => {
    const className = cn(styles.container, styles.variants[variant], {
      [styles.label]: label,
      [styles.active]: active,
      [styles.bordered]: bordered,
      [styles.noBackgroundFill]: noBackgroundFill,
    })

    const isExternal = href && isLinkExternal(href)

    const anchorProps = {
      ...(isExternal && { rel: 'noreferrer noopener' }),
    }

    const sharedProps = {
      className,
      ref,
    }

    const content = (
      <Typography variant="tag" as="span">
        {children}
      </Typography>
    )

    if (label) {
      return <span {...sharedProps}>{content}</span>
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
