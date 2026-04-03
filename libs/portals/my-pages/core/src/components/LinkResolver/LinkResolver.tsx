import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { formatPlausiblePathToParams } from '../../utils/formatPlausiblePathToParams'
import { isExternalLink } from '../../utils/isExternalLink'
import * as styles from './LinkResolver.css'
import cn from 'classnames'
import { servicePortalOutboundLink } from '@island.is/plausible'
import { useRoutes } from '@island.is/portals/core'
interface Props {
  children?: ReactNode
  className?: string
  href: string
  label?: string
  skipOutboundTrack?: boolean
  callback?: () => void
}

export const LinkResolver = ({
  href = '/',
  children,
  className,
  skipOutboundTrack,
  callback,
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
          !skipOutboundTrack || callback
            ? () => {
                if (!skipOutboundTrack) {
                  servicePortalOutboundLink({
                    url: formatPlausiblePathToParams(pathname, routePaths).url,
                    outboundUrl: href,
                  })
                }
                if (callback) {
                  callback()
                }
              }
            : undefined
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
      onClick={callback}
    >
      {children}
    </Link>
  )
}

export default LinkResolver
