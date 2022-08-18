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

export default async function handler(req, res) {
  const tag = (req.query?.tag as string) ?? FRONTPAGE_NEWS_TAG_ID
  const locale = isLocale(req.query?.lang) ? req.query.lang : defaultLanguage
  const organization = req.query?.organization

  const apolloClient = initApollo({}, locale)

  const news = await apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
    query: GET_NEWS_QUERY,
    variables: {
      input: {
        lang: locale as ContentLanguage,
        size: 25,
        tag,
      },
    },
  })

  const host: string = req.headers.host
  const protocol = `http${host.startsWith('localhost') ? '' : 's'}://`
  const baseUrl = `${protocol}${host}`

  const newsItem = (item: GetNewsQuery['getNews']['items'][0]) => {
    const url = organization
      ? linkResolver('organizationnews', [organization, item.slug]).href
      : linkResolver('news', [item.slug]).href
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

  res.set('Content-Type', 'text/xml;charset=UTF-8')
  return res.status(200).send(feed)
}
