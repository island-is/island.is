import React from 'react'
import NextLink, { LinkProps } from 'next/link'
import cn from 'classnames'
import * as styles from './Link.treat'

const isLinkInternal = (href: string) => {
  // If it's a relative url such as '/path', 'path' and does not contain a protocol we can assume it is internal.
  if (href.indexOf('://') === -1) return true

  return false
}

interface Props extends LinkProps {
  color?: 'white' | 'blue400'
  className?: string
  withUnderline?: boolean
}

// Next link that can handle external urls
const Link: React.FC<Props> = ({
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
  withUnderline,
  ...linkProps
}) => {
  const isInternal = isLinkInternal(href as string)
  const classNames = cn(
    styles.link,
    color ? styles.colors[color] : undefined,
    className,
    {
      [styles.withUnderline]: withUnderline,
    },
  )

  if (isInternal) {
    return (
      <NextLink
        href={href}
        shallow={shallow}
        scroll={scroll}
        passHref={passHref}
        prefetch={prefetch}
      >
        <a className={classNames} {...linkProps}>
          {children}
        </a>
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

export default Link
