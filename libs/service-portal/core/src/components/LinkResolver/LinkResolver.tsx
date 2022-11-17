import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { isExternalLink } from '../..'
import * as styles from './LinkResolver.css'
interface Props {
  children?: ReactNode
  href: string
}

export const LinkResolver = ({ href = '/', children }: Props) => {
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
    <Link className={styles.link} to={href}>
      {children}
    </Link>
  )
}

export default LinkResolver
