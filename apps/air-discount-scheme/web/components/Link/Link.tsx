import React, { FC } from 'react'
import NextLink from 'next/link'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'
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

export const Link: FC<React.PropsWithChildren<LinkProps>> = ({
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
      {shouldLinkOpenInNewWindow(href) ? (
        <a
          href={href}
          className={styles.link}
          target="_blank"
          rel="noreferrer noopener"
        >
          {children}
          <span className={styles.icon}>
            <Icon aria-hidden="true" type="external" width={14} />
          </span>
        </a>
      ) : (
        <NextLink href={href} legacyBehavior>
          {childIsString ? <a>{children}</a> : children}
        </NextLink>
      )}
    </Typography>
  )
}

export default Link
