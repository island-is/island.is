import React, { forwardRef } from 'react'
import cn from 'classnames'
import { Typography } from '../Typography/Typography'

import * as styles from './Tag.treat'

export type TagVariant = 'blue' | 'darkerBlue' | 'purple'

export interface TagProps {
  onClick?: () => void
  variant?: TagVariant
  href?: string
  disabled?: boolean
  label?: boolean
  children: string
}

const isLinkExternal = (href: string): boolean => href.indexOf('://') > 0

export const Tag = forwardRef<HTMLButtonElement & HTMLAnchorElement, TagProps>(
  (
    {
      children,
      href,
      onClick,
      variant = 'blue',
      disabled,
      label,
      ...props
    }: TagProps,
    ref,
  ) => {
    const className = cn(styles.container, styles.variants[variant], {
      [styles.label]: label,
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
        {content} anchor
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
