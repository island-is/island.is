import type { NextApiRequest, NextApiResponse } from 'next'
import { parseAsString } from 'next-usequerystate'

import initApollo from '@island.is/web/graphql/client'
import {
  GetCourtAgendasQuery,
  GetCourtAgendasQueryVariables,
} from '@island.is/web/graphql/schema'
import { GET_COURT_AGENDAS_QUERY } from '@island.is/web/screens/queries/CourtAgendas'

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
  const baseUrl = `${protocol}${host}/dagskra-domstola`

  let itemString = ''
  const court = parseAsString.parseServerSide(req.query?.court)

  const agendas = await apolloClient.query<
    GetCourtAgendasQuery,
    GetCourtAgendasQueryVariables
  >({
    query: GET_COURT_AGENDAS_QUERY,
    variables: {
      input: {
        page: 1,
        court: court ?? undefined,
      },
    },
  })

  itemString = (agendas?.data?.webCourtAgendas?.items ?? [])
    .map((item) => {
      const date = item.dateFrom ? new Date(item.dateFrom).toUTCString() : ''
      return generateItemString({
        date,
        description: item.title,
        fullUrl: `${baseUrl}/${item.id}`,
        title: `${item.caseNumber}${
          item.courtRoom ? ` - ${item.courtRoom}` : ''
        }${item.court ? ` - ${item.court}` : ''}${date ? ` - ${date}` : ''}`,
        id: item.id,
      })
    })
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
  <channel>
  <title>Dagskrá dómstóla á Ísland.is</title>
  <link>${baseUrl}</link>
  ${itemString}
  </channel>
  </rss>`

  res.setHeader('Content-Type', 'text/xml;charset=UTF-8')
  return res.status(200).send(feed)
}
