import React from 'react'
import NextLink, { LinkProps } from 'next/link'
import cn from 'classnames'
import * as styles from './Link.treat'

const isLinkInternal = (href: string) => {
  if (typeof href === 'string' && href.indexOf('://') !== -1) return false

  return true
}

export type LinkColor = 'white' | 'blue400' | 'blue600'
export type UnderlineVisibility = 'always' | 'hover'
export type UnderlineVariants = 'normal' | 'small'

interface Props extends LinkProps {
  color?: LinkColor
  className?: string
  underline?: UnderlineVariants
  underlineVisibility?: UnderlineVisibility
  onClick?: () => void
  pureChildren?: boolean
}

// Next link that can handle external urls
export const Link: React.FC<Props> = ({
  children,
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  color,
  className,
  underline,
  underlineVisibility = 'hover',
  pureChildren,
  ...linkProps
}) => {
  const isInternal = isLinkInternal(href as string)
  const classNames = cn(
    styles.link,
    color ? styles.colors[color] : undefined,
    underline ? styles.underlines[underline] : undefined,
    underline && underlineVisibility
      ? styles.underlineVisibilities[underlineVisibility]
      : undefined,
    className,
  )

  // In next 9.5.3 and later, this will be unnecessary, since the as parameter will be
  // optiona - but as things stand, as is needed if you have a dynamic href
  const prefetchDefault = !as ? false : prefetch

  if (isInternal) {
    return (
      <NextLink
        href={href}
        as={as}
        shallow={shallow}
        scroll={scroll}
        passHref={passHref}
        prefetch={prefetchDefault}
      >
        {pureChildren ? (
          children
        ) : (
          <a className={classNames} {...linkProps}>
            {children}
          </a>
        )}
      </NextLink>
    )
  } else {
    return (
      <a
        href={href as string}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames}
        {...linkProps}
      >
        {children}
      </a>
    )
  }
}
