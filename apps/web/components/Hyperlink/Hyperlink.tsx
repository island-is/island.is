/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
import { Icon, Typography, TypographyProps } from '@island.is/island-ui/core'
import useRouteNames, { pathTypes } from '../../i18n/useRouteNames'
import { Locale } from '@island.is/web/i18n/I18n'

import * as styles from './Hyperlink.treat'

interface HyperlinkProps {
  href?: string
  slug?: string
  pathType?: pathTypes
  locale?: Locale
  variant?: TypographyProps['variant']
  as?: TypographyProps['as']
}

const isLinkInternal = (href: string): boolean => href.indexOf('://') !== -1

export const Hyperlink: FC<HyperlinkProps> = ({
  href,
  slug,
  pathType,
  locale,
  variant = 'p',
  as = 'span',
  children,
}) => {
  const { makePath } = useRouteNames(locale)
  const isExternalLink = href ? isLinkInternal(href) : null

  let internalLink = null

  if (pathType && slug) {
    internalLink = makePath(pathType, slug)
  }

  const linkProps = {
    prefetch: !isExternalLink,
    passHref: isExternalLink,
    ...(!isExternalLink && { as: internalLink }),
    href: isExternalLink ? href : makePath(pathType, '[slug]'),
  }

  const anchorProps = {
    ...(isExternalLink && { rel: 'noreferrer noopener' }),
  }

  if (!linkProps.href) {
    return <>{children}</>
  }

  const props = {
    variant,
    as,
  }

  return (
    <Typography links {...props}>
      <Link {...linkProps}>
        <a className={styles.link} {...anchorProps}>
          {children}
          {isExternalLink && (
            <span className={styles.icon}>
              <Icon type="external" width={14} />
            </span>
          )}
        </a>
      </Link>
    </Typography>
  )
}

export default Hyperlink
