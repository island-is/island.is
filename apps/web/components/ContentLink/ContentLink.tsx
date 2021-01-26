import React, { FC, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Link } from '@island.is/island-ui/core'
import { getLocaleFromPath } from '@island.is/web/i18n/withLocale'
import { defaultLanguage } from '@island.is/web/i18n/I18n'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface ContentLinkProps {
  pageData: string
  href?: string
  fallbackLink?: string
  children: ReactNode
}

export const ContentLink: FC<ContentLinkProps> = ({
  pageData = null,
  href = '[slug]',
  fallbackLink,
  children,
}) => {
  const Router = useRouter()
  const { linkResolver } = useLinkResolver()

  const { asPath } = Router

  let locale = defaultLanguage

  if (asPath) {
    locale = getLocaleFromPath(asPath)
  }

  const data = pageData && JSON.parse(pageData)

  const contentType = data?.sys?.contentType?.sys?.id ?? ''
  const slug = data?.fields?.slug ?? ''

  if (!contentType || !slug) {
    if (!fallbackLink) {
      return null
    }

    return (
      <Link href={fallbackLink} passHref pureChildren>
        {children}
      </Link>
    )
  }

  const linkProps = linkResolver(contentType, [slug])

  return (
    <Link {...linkProps} passHref pureChildren>
      {children}
    </Link>
  )
}

export default ContentLink
