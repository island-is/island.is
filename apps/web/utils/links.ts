import { LinkProps } from 'next/link'
import { Link } from '@island.is/web/graphql/schema'
import { defaultLanguage } from '@island.is/web/types'
import routeNames, { PathTypes } from '@island.is/web/routes'

export const getLink = ({
  pageData = '',
  locale = defaultLanguage,
  href = '[slug]',
}) => {
  if (!pageData) {
    return null
  }

  const { makePath } = routeNames(locale)

  const data = pageData && JSON.parse(pageData)

  const contentType = data?.sys?.contentType?.sys?.id ?? ''
  const slug = data?.fields?.slug ?? ''

  if (!contentType || !slug) {
    return null
  }

  const newHref = makePath(contentType, href)
  const as = makePath(contentType, slug)

  return {
    href: newHref,
    as,
  }
}
