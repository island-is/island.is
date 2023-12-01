import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { formatPlausiblePathToParams, isExternalLink } from '../..'
import * as styles from './LinkResolver.css'
import cn from 'classnames'
import { servicePortalOutboundLink } from '@island.is/plausible'
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
  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(styles.link, {
          [`${className}`]: className,
        })}
        onClick={() =>
          skipOutboundTrack
            ? undefined
            : servicePortalOutboundLink({
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
