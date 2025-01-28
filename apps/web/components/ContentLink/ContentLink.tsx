import React, { FC, ReactNode } from 'react'

import { Link } from '@island.is/island-ui/core'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface ContentLinkProps {
  pageData: string
  href?: string
  fallbackLink?: string
  children: ReactNode
}

export const ContentLink: FC<React.PropsWithChildren<ContentLinkProps>> = ({
  pageData = null,
  fallbackLink,
  children,
}) => {
  const { linkResolver } = useLinkResolver()

  const data = pageData && JSON.parse(pageData)

  const contentType = data?.sys?.contentType?.sys?.id ?? ''
  const slug = data?.fields?.slug ?? ''

  if (!contentType || !slug) {
    if (!fallbackLink) {
      return null
    }

    return (
      <Link href={fallbackLink} skipTab>
        {children}
      </Link>
    )
  }

  const linkProps = linkResolver(contentType, [slug])

  return (
    <Link {...linkProps} skipTab>
      {children}
    </Link>
  )
}

export default ContentLink
