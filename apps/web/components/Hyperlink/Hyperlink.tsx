/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, ReactElement } from 'react'
import Link from 'next/link'
import { Icon, Typography, Inline, Box } from '@island.is/island-ui/core'
import useRouteNames, { pathTypes } from '../../i18n/useRouteNames'
import { Locale } from '@island.is/web/i18n/I18n'

import * as styles from './Hyperlink.treat'

interface HyperlinkProps {
  href?: string
  slug?: string
  pathType?: pathTypes
  locale?: Locale
  children: ReactElement
}

const isLinkInternal = (href: string): boolean => href.indexOf('://') !== -1

export const Hyperlink: FC<HyperlinkProps> = ({
  href,
  slug,
  pathType,
  locale,
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
    return children
  }

  return (
    <Link {...linkProps}>
      <a className={styles.link} {...anchorProps}>
        <Inline space={1} alignY="center">
          <Typography variant="p" as="span" color="blue400">
            {children}
          </Typography>
          {isExternalLink ? (
            <Box display="flex" alignItems="center" role="presentation">
              <Icon type="external" width={14} color="blue400" />
            </Box>
          ) : null}
        </Inline>
      </a>
    </Link>
  )
}

export default Hyperlink
