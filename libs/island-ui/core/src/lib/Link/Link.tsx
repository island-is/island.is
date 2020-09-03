import React from 'react'
import NextLink, { LinkProps } from 'next/link'
import { Colors } from '@island.is/island-ui/theme'
import cn from 'classnames'
import * as styles from './Link.treat'

const isLinkInternal = (href) => {
  if (typeof href === 'string' && href.indexOf('://') !== -1) return false

  return true
}

interface Props extends LinkProps {
  color?: Colors
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
  const isInternal = isLinkInternal(href)
  const classNames = cn(styles.link, styles.colors[color], className, {
    [styles.withUnderline]: withUnderline,
  })

  if (isInternal) {
    return (
      <NextLink
        href={href}
        as={as}
        shallow={shallow}
        scroll={scroll}
        passHref={passHref}
        prefetch={prefetch}
        as={as}
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
        rel="noopener"
        className={classNames}
        {...linkProps}
      >
        {children}
      </a>
    )
  }
}

export default Link
