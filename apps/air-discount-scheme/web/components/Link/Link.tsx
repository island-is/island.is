import React, { FC } from 'react'
import NextLink from 'next/link'
import { Icon, Typography, TypographyProps } from '@island.is/island-ui/core'

import * as styles from './Link.treat'

interface LinkProps {
  href?: string
  slug?: string
  variant?: TypographyProps['variant']
  as?: TypographyProps['as']
}

const isLinkExternal = (href: string): boolean => {
  const link = document.createElement('a')
  link.href = href
  return link.hostname !== window.location.hostname
}

export const Link: FC<LinkProps> = ({
  href,
  variant = 'p',
  as = 'span',
  children,
}) => {
  const isExternalLink = isLinkExternal(href)

  const props = {
    variant,
    as,
  }

  const childIsString =
    typeof children === 'string' || children instanceof String

  return (
    <Typography links {...props}>
      {isExternalLink ? (
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
        <NextLink href={href} as="a">
          {childIsString ? <a>{children}</a> : children}
        </NextLink>
      )}
    </Typography>
  )
}

export default Link
