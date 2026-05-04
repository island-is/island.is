import escape from 'escape-html'
import type { NextApiRequest, NextApiResponse } from 'next'

import initApollo from '@island.is/web/graphql/client'
import {
  GetSupremeCourtAppealsQuery,
  GetSupremeCourtAppealsQueryVariables,
} from '@island.is/web/graphql/schema'
import { GET_SUPREME_COURT_APPEALS_QUERY } from '@island.is/web/screens/queries/SupremeCourtAppeals'

interface Item {
  date: string | null | undefined
  fullUrl: string
  title: string
  description: string | null | undefined
  id: string
}

const generateItemString = (item: Item) => {
  return `<item>
  <title>${escape(item.title)}</title>
  <link>${escape(item.fullUrl)}</link>
  ${
    item.description
      ? `<description>${escape(item.description)}</description>`
      : ''
  }
  <guid isPermaLink="false">${escape(item.id)}</guid>
  ${item.date ? ` <pubDate>${escape(item.date)}</pubDate>` : ''}
  </item>`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const apolloClient = initApollo({}, 'is')

  const host = req.headers?.host
  const protocol = `http${host?.startsWith('localhost') ? '' : 's'}://`
  const baseUrl = `${protocol}${host}/s/haestirettur/afryjud-mal`

  const appeals = await apolloClient.query<
    GetSupremeCourtAppealsQuery,
    GetSupremeCourtAppealsQueryVariables
  >({
    query: GET_SUPREME_COURT_APPEALS_QUERY,
    variables: {
      input: {
        page: 1,
      },
    },
  })

  const itemString = (appeals?.data?.webSupremeCourtAppeals?.items ?? [])
    .map((item) =>
      generateItemString({
        date: item.verdictDate
          ? new Date(item.verdictDate).toUTCString()
          : item.appealPolicyDate
          ? new Date(item.appealPolicyDate).toUTCString()
          : item.registrationDate
          ? new Date(item.registrationDate).toUTCString()
          : '',
        description: item.title,
        fullUrl: baseUrl,
        title: item.caseNumber,
        id: item.id,
      }),
    )
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
  <channel>
  <title>Áfrýjuð mál Hæstaréttar á Ísland.is</title>
  <link>${escape(baseUrl)}</link>
  ${itemString}
  </channel>
  </rss>`

  res.setHeader('Content-Type', 'text/xml;charset=UTF-8')
  return res.status(200).send(feed)
}
