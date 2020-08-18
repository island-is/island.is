/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { Icon, Typography, TypographyProps } from '@island.is/island-ui/core'

import * as styles from './Hyperlink.treat'

interface HyperlinkProps {
  href?: string
  slug?: string
  variant?: TypographyProps['variant']
  as?: TypographyProps['as']
}

const isLinkInternal = (href: string): boolean => href.indexOf('://') !== -1

export const Hyperlink: FC<HyperlinkProps> = ({
  href,
  variant = 'p',
  as = 'span',
  children,
}) => {
  const isExternalLink = href ? isLinkInternal(href) : null

  const anchorProps = {
    ...(isExternalLink && { rel: 'noreferrer noopener' }),
  }

  const props = {
    variant,
    as,
  }

  return (
    <Typography links {...props}>
      <a href={href} className={styles.link} {...anchorProps}>
        {children}
        {isExternalLink && (
          <span className={styles.icon}>
            <Icon type="external" width={14} />
          </span>
        )}
      </a>
    </Typography>
  )
}

export default Hyperlink
