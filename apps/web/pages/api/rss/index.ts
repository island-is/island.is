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

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Ísland.is</title>
    <link>https://island.is</link>
    <description>Ísland.is</description>${news?.data?.getNews?.items
      ?.map(
        (newsItem) => `
    <item>
      <title>${newsItem.title}</title>
      <link>https://island.is${
        linkResolver('news', [newsItem.slug]).href
      }</link>
      <description>${newsItem.intro}</description>
      <pubDate>${new Date(newsItem.date).toUTCString()}</pubDate>
    </item>`,
      )
      .join('')}
  </channel>
</rss>`

  res.set('Content-Type', 'text/xml;charset=UTF-8')
  return res.status(200).send(feed)
}
