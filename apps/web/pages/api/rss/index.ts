import type { NextApiRequest, NextApiResponse } from 'next'
import type { Locale } from 'locale'
import {
  ContentLanguage,
  GetNewsQuery,
  QueryGetNewsArgs,
} from '@island.is/web/graphql/schema'
import { GET_NEWS_QUERY } from '@island.is/web/screens/queries'
import initApollo from '@island.is/web/graphql/client'
import { FRONTPAGE_NEWS_TAG_ID } from '@island.is/web/constants'
import { isLocale } from '@island.is/web/i18n/I18n'
import { defaultLanguage } from '@island.is/shared/constants'
import { linkResolver } from '@island.is/web/hooks'

const extractTagsFromQuery = (query: NextApiRequest['query']) => {
  if (typeof query?.tags === 'string') {
    return [query.tags]
  }
  if (typeof query?.tags?.length === 'number' && query.tags.length > 0) {
    return query.tags
  }
  if (query?.organization) {
    return []
  }

  // If nothing is defined in query we'll show frontpage news
  return [FRONTPAGE_NEWS_TAG_ID]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const tags = extractTagsFromQuery(req.query)
  const locale = isLocale(req.query?.lang as string)
    ? (req.query.lang as Locale)
    : defaultLanguage
  const organization = req.query?.organization as string | undefined

  const apolloClient = initApollo({}, locale)

  const news = await apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
    query: GET_NEWS_QUERY,
    variables: {
      input: {
        lang: locale as ContentLanguage,
        size: 25,
        tags,
        organization,
      },
    },
  })

  const host = req.headers?.host
  const protocol = `http${host?.startsWith('localhost') ? '' : 's'}://`
  const baseUrl = `${protocol}${host}`

  const newsItem = (item: GetNewsQuery['getNews']['items'][0]) => {
    const url = organization
      ? linkResolver('organizationnews', [organization, item.slug], locale).href
      : linkResolver('news', [item.slug], locale).href
    const date = new Date(item.date).toUTCString()

    return `<item>
      <title>${item.title}</title>
      <link>${baseUrl}${url}</link>
      <description>${item.intro}</description>
      <pubDate>${date}</pubDate>
    </item>`
  }

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Ísland.is</title>
        <link>${baseUrl}</link>
        <description>Ísland.is</description>
        ${news?.data?.getNews?.items?.map((item) => newsItem(item)).join('')}
      </channel>
    </rss>`

  res.setHeader('Content-Type', 'text/xml;charset=UTF-8')
  return res.status(200).send(feed)
}
