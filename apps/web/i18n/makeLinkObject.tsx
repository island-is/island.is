import { useRouter } from 'next/router'
import routeNames from './routeNames'
import { getLocaleFromPath } from './withLocale'
import { defaultLanguage } from './I18n'

interface UseMakeLinkObjectProps {
  pageData: string | null
  href?: string
}

export const makeLinkObject = ({
  pageData = null,
  href = '[slug]',
}: UseMakeLinkObjectProps): { href: string; as: string } | null => {
  const Router = useRouter()

  const { asPath } = Router

  let locale = defaultLanguage

  if (asPath) {
    locale = getLocaleFromPath(asPath)
  }

  const { makePath } = routeNames(locale)

  const data = pageData && JSON.parse(pageData)

  if (!data) {
    return null
  }

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

export default makeLinkObject
