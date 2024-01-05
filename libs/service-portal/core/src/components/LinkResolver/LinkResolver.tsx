import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { formatPlausiblePathToParams, isExternalLink } from '../..'
import * as styles from './LinkResolver.css'
import cn from 'classnames'
import { servicePortalOutboundLink } from '@island.is/plausible'
import { useRoutes } from '@island.is/portals/core'
interface Props {
  children?: ReactNode
  className?: string
  href: string
  skipOutboundTrack?: boolean
}

export const LinkResolver = ({
  href = '/',
  children,
  className,
  skipOutboundTrack,
}: Props) => {
  const { pathname } = useLocation()
  const routes = useRoutes()
  const routePaths = routes.map((item) => item.path)

  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(styles.link, {
          [`${className}`]: className,
        })}
        onClick={
          skipOutboundTrack
            ? undefined
            : () =>
                servicePortalOutboundLink({
                  url: formatPlausiblePathToParams(pathname, routePaths).url,
                  outboundUrl: href,
                })
        }
      >
        {children}
      </a>
    )
  }
  return (
    <Link
      className={cn(styles.link, {
        [`${className}`]: className,
      })}
      to={href}
    >
      {children}
    </Link>
  )
}

export default LinkResolver
