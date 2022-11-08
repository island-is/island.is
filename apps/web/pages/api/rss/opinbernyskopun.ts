import {
  FaqList,
  GetProjectPageQuery,
  QueryGetProjectPageArgs,
} from '@island.is/web/graphql/schema'
import initApollo from '@island.is/web/graphql/client'
import { isLocale } from '@island.is/web/i18n/I18n'
import { defaultLanguage } from '@island.is/shared/constants'
import { GET_PROJECT_PAGE_QUERY } from '@island.is/web/screens/queries/Project'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

export default async function handler(req, res) {
  const locale = isLocale(req.query?.lang) ? req.query.lang : defaultLanguage

  const apolloClient = initApollo({}, locale)

  const projectPage = await apolloClient.query<
    GetProjectPageQuery,
    QueryGetProjectPageArgs
  >({
    query: GET_PROJECT_PAGE_QUERY,
    variables: { input: { slug: 'opinbernyskopun', lang: locale } },
  })

  const host: string = req.headers.host
  const protocol = `http${host.startsWith('localhost') ? '' : 's'}://`
  const baseUrl = `${protocol}${host}`

  const faqListItems =
    (projectPage.data?.getProjectPage?.projectSubpages
      ?.find((page) => page?.['id'] === '3j57NCZLSoqxrXdU12eUwz')
      ?.content?.find((slice) => slice?.__typename === 'FaqList') as FaqList)
      ?.questions ?? []

  const getItem = (item: FaqList['questions'][number]) => {
    return `<item>
      <title>${item.question}</title>
      <description>${item.answer
        .map((answer) => documentToPlainTextString(answer['document']))
        .join('\n')}</description>
    
    </item>`
  }

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Opinber nýsköpun</title>
          <link>${baseUrl}</link>
          <description>Ísland.is</description>
          ${faqListItems.map((i) => getItem(i)).join('')}
        </channel>
      </rss>`

  res.set('Content-Type', 'text/xml;charset=UTF-8')
  return res.status(200).send(feed)
}
