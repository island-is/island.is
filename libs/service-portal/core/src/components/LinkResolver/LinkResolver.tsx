import React, { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { formatPlausiblePathToParams, isExternalLink } from '../..'
import * as styles from './LinkResolver.css'
import { servicePortalOutboundLink } from '@island.is/plausible'
interface Props {
  children?: ReactNode
  href: string
}

export const LinkResolver = ({ href = '/', children }: Props) => {
  const { pathname } = useLocation()

  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={styles.link}
        onClick={() =>
          servicePortalOutboundLink({
            url: formatPlausiblePathToParams(pathname).url,
            outboundUrl: href,
          })
        }
      >
        {children}
      </a>
    )
  }
  return (
    <Link className={styles.link} to={href}>
      {children}
    </Link>
  )
}

export default LinkResolver
