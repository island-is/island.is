import React, { ReactNode } from 'react'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'
import { Link } from 'react-router-dom'

interface Props {
  children?: ReactNode
  href: string
}

export const LinkResolver = ({ href = '/', children }: Props) => {
  if (shouldLinkOpenInNewWindow(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    )
  }
  return <Link to={href}>{children}</Link>
}

export default LinkResolver
