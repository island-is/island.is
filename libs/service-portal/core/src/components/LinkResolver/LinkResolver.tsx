import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { isExternalLink } from '../..'

interface Props {
  children?: ReactNode
  href: string
}

export const LinkResolver = ({ href = '/', children }: Props) => {
  if (isExternalLink(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    )
  }
  return <Link to={href}>{children}</Link>
}

export default LinkResolver
