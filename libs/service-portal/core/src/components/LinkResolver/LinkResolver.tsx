import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { isExternalLink } from '../..'
import * as styles from './LinkResolver.css'
import cn from 'classnames'
interface Props {
  children?: ReactNode
  className?: string
  href: string
}

export const LinkResolver = ({ href = '/', children, className }: Props) => {
  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={styles.link}
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
