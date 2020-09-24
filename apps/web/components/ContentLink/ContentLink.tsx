import React, { FC, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Link } from '@island.is/island-ui/core'
import routeNames from '@island.is/web/i18n/routeNames'
import { getLocaleFromPath } from '@island.is/web/i18n/withLocale'
import { defaultLanguage } from '@island.is/web/i18n/I18n'

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

  const { asPath } = Router

  let locale = defaultLanguage

  if (asPath) {
    locale = getLocaleFromPath(asPath)
  }

  const { makePath } = routeNames(locale)

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

  const newHref = makePath(contentType, href)
  const as = makePath(contentType, slug)

  const linkProps = {
    href: newHref,
    as,
  }

  return (
    <Link {...linkProps} passHref pureChildren>
      {children}
    </Link>
  )
}

export default ContentLink
