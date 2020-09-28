import React, { FC, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Link } from '@island.is/island-ui/core'
import { getLocaleFromPath } from '@island.is/web/i18n/withLocale'
import { defaultLanguage } from '@island.is/web/types'
import { getLink } from '@island.is/web/utils/links'

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

  const linkProps = getLink({ locale, pageData, href })

  if (!linkProps) {
    if (!fallbackLink) {
      return null
    }

    return (
      <Link href={fallbackLink} passHref pureChildren>
        {children}
      </Link>
    )
  }

  return (
    <Link {...linkProps} passHref pureChildren>
      {children}
    </Link>
  )
}

export default ContentLink
