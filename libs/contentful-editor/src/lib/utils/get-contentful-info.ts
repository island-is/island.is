import { NextPageContext } from 'next'

interface Types {
  id: string
  matches: string[]
}

export const getContentfulInfo = (ctx: NextPageContext, types: Types[]) => {
  const { slug } = ctx.query
  const path = ctx.asPath?.split('/').filter(Boolean)
  const isEn = path?.[0] === 'en'
  const firstPath = isEn ? path?.[1] : path?.[0]
  let contentType = 'article' // Default to article

  /**
   * If url has `/en` and only another path after, or if we only have one path
   * and not `/en` specified, we check if the path is an article's name or a content type
   */
  if ((isEn && path?.length === 2) || (!isEn && path?.length === 1)) {
    const firstPathRes = types.find((type) => type.id === firstPath)

    if (firstPathRes) {
      contentType = firstPathRes.id
    }
  }

  const res = types.find((t) => t.matches.find((item) => item === firstPath))

  if (res) {
    contentType = res.id
  }

  return {
    slug,
    contentType,
    locale: isEn ? 'en' : 'is-IS',
  }
}
