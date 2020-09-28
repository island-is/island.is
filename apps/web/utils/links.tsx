import { LinkProps } from 'next/link'
import { Link } from '@island.is/web/graphql/schema'
import routeNames, { PathTypes } from '@island.is/web/i18n/routeNames'
import { defaultLanguage } from '@island.is/web/i18n/I18n'

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

export const getLinkProps = (
  linkedPage: Link['linkedPage'],
): Pick<LinkProps, 'as' | 'href'> | null => {
  const { makePath } = routeNames()

  if (linkedPage?.page) {
    const { slug, type } = linkedPage.page

    return {
      href: makePath(type as PathTypes, '[slug]'),
      as: makePath(type as PathTypes, slug),
    }
  }

  return null
}
