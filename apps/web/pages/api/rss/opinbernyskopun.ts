import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

import initApollo from '@island.is/web/graphql/client'
import {
  FaqList,
  GetProjectPageQuery,
  QueryGetProjectPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_PROJECT_PAGE_QUERY } from '@island.is/web/screens/queries/Project'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
export default async function handler(req, res) {
  const apolloClient = initApollo({})

  const projectPage = await apolloClient.query<
    GetProjectPageQuery,
    QueryGetProjectPageArgs
  >({
    query: GET_PROJECT_PAGE_QUERY,
    variables: { input: { slug: 'opinbernyskopun', lang: 'is' } },
  })

  const projectSubpage =
    projectPage.data?.getProjectPage?.projectSubpages?.find(
      (page) => page?.slug === 'askoranir-opinberra-adila',
    )

  const faqListItems =
    (
      projectSubpage?.content?.find(
        (slice) => slice?.__typename === 'FaqList',
      ) as FaqList
    )?.questions ?? []

  const host: string = req.headers.host
  const protocol = `http${host.startsWith('localhost') ? '' : 's'}://`
  const baseUrl = `${protocol}${host}`

  const link = `${baseUrl}/v/${
    projectPage.data?.getProjectPage?.slug ?? 'opinbernyskopun'
  }/${projectSubpage?.slug ?? 'askoranir-opinberra-adila'}`

  const getItem = (item: FaqList['questions'][number]) => {
    return `<item>
        <title>${item.question}</title>
        <guid>${item.id}</guid>
        <link>${link}</link>
        <pubDate>${
          item.publishDate ? new Date(item.publishDate).toUTCString() : ''
        }</pubDate>
        <description>${item.answer
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          .map((answer) => documentToHtmlString(answer['document']))
          .join('\n')}</description>
      </item>`
  }

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0">
          <channel>
            <title>Opinber nýsköpun - nýjar áskoranir</title>
            <link>${link}</link>
            <description>Ísland.is</description>
            ${faqListItems.map((i) => getItem(i)).join('')}
          </channel>
        </rss>`

  res.set('Content-Type', 'text/xml;charset=UTF-8')
  return res.status(200).send(feed)
}
