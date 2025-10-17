import type { NextApiRequest, NextApiResponse } from 'next'
import { parseAsString } from 'next-usequerystate'

import initApollo from '@island.is/web/graphql/client'
import {
  GetVerdictsQuery,
  GetVerdictsQueryVariables,
} from '@island.is/web/graphql/schema'
import { GET_VERDICTS_QUERY } from '@island.is/web/screens/queries/Verdicts'

interface Item {
  date: string | null | undefined
  fullUrl: string
  title: string
  description: string | null | undefined
  id: string
}

const generateItemString = (item: Item) => {
  return `<item>
  <title>${item.title}</title>
  <link>${item.fullUrl}</link>
  ${item.description ? `<description>${item.description}</description>` : ''}
  <guid isPermaLink="false">${item.id}</guid>
  ${item.date ? ` <pubDate>${item.date}</pubDate>` : ''}
  </item>`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const apolloClient = initApollo({}, 'is')

  const host = req.headers?.host
  const protocol = `http${host?.startsWith('localhost') ? '' : 's'}://`
  const baseUrl = `${protocol}${host}/domar`

  let itemString = ''
  const court = parseAsString.parseServerSide(req.query?.court)

  const verdicts = await apolloClient.query<
    GetVerdictsQuery,
    GetVerdictsQueryVariables
  >({
    query: GET_VERDICTS_QUERY,
    variables: {
      input: {
        page: 1,
        courtLevel: court ?? undefined,
      },
    },
  })

  itemString = (verdicts?.data?.webVerdicts?.items ?? [])
    .map((item) =>
      generateItemString({
        date: item.verdictDate ? new Date(item.verdictDate).toUTCString() : '',
        description: item.title,
        fullUrl: `${baseUrl}/${item.id}`,
        title: item.caseNumber,
        id: item.id,
      }),
    )
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
  <channel>
  <title>Dómar og úrskurðir á Ísland.is</title>
  <link>${baseUrl}</link>
  ${itemString}
  </channel>
  </rss>`

  res.setHeader('Content-Type', 'text/xml;charset=UTF-8')
  return res.status(200).send(feed)
}
