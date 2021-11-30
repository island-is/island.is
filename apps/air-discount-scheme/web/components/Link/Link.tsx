import React, { FC } from 'react'
import NextLink from 'next/link'
import {
  IconDeprecated as Icon,
  Typography,
  TypographyProps,
} from '@island.is/island-ui/core'

import * as styles from './Link.css'

interface LinkProps {
  href?: string
  slug?: string
  variant?: TypographyProps['variant']
  as?: TypographyProps['as']
}

const isLinkExternal = (href: string): boolean =>
  typeof href === 'string' && href.indexOf('://') !== -1

export const Link: FC<LinkProps> = ({
  href,
  variant = 'p',
  as = 'span',
  children,
}) => {
  const props = {
    variant,
    as,
  }

  if (!href) {
    return <Typography {...props}>{children}</Typography>
  }

  const childIsString =
    typeof children === 'string' || children instanceof String

  return (
    <Typography links {...props}>
      {isLinkExternal(href) ? (
        <a
          href={href}
          className={styles.link}
          target="_blank"
          rel="noreferrer noopener"
        >
          {children}
          <span className={styles.icon}>
            <Icon type="external" width={14} />
          </span>
        </a>
      ) : (
        <NextLink href={href}>
          {childIsString ? <a>{children}</a> : children}
        </NextLink>
      )}
    </Typography>
  )
}

export default Link
