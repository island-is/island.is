import { NextApiRequest, NextApiResponse } from 'next'
import initApollo from '../../graphql/client'
import { SUB_GET_CASES } from '../../graphql/queries.graphql'
import RSS from 'rss'
import { SubGetCasesQuery } from '../../graphql/queries.graphql.generated'
import { SUB_PAGE_SIZE, SUB_STATUSES_TO_FETCH } from '../../utils/consts/consts'

type CaseItem = {
  id?: number | null
  caseNumber?: string | null
  name?: string | null
  institutionName?: string | null
  policyAreaName?: string | null
}

const generateBaseUrl = (req: NextApiRequest): string => {
  const host: string = req.headers.host
  const protocol = `http${host.startsWith('localhost') ? '' : 's'}://`
  return `${protocol}${host}`
}

const generateRssFeed = (baseUrl: string, cases: CaseItem[]): string => {
  const feed = new RSS({
    title: 'Samráðsgátt - RSS Feed',
    description: cases.length
      ? 'Áskrift af málum'
      : 'Engin mál eru skráð þessa stundina.',
    language: 'is',
    feed_url: `${baseUrl}/samradsgatt/api/rss`,
    site_url: `${baseUrl}/samradsgatt`,
    copyright: `Allur réttur áskilinn ${new Date().getFullYear()}, Island.is`,
  })

  if (cases.length) {
    cases.forEach((post) => {
      feed.item({
        title: post.name,
        description: '', // Posts do not have a description
        url: `${baseUrl}/samradsgatt/mal/${post.id}`,
        date: '', // Posts do not have a date
        custom_elements: [
          { caseNumber: post.caseNumber },
          { institutionName: post.institutionName },
          { policyAreaName: post.policyAreaName },
        ],
      })
    })
  }

  return feed.xml({ indent: true })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = initApollo()
  try {
    const {
      data: { consultationPortalGetCases },
    } = await client.query<SubGetCasesQuery>({
      query: SUB_GET_CASES,
      variables: {
        input: {
          caseStatuses: SUB_STATUSES_TO_FETCH,
          pageSize: SUB_PAGE_SIZE,
        },
      },
    })

    const baseUrl = generateBaseUrl(req)
    const rss = generateRssFeed(
      baseUrl,
      consultationPortalGetCases?.cases || [],
    )

    res.setHeader('Content-Type', 'application/xml')
    res.status(200).send(rss)
  } catch (error) {
    if (error.networkError) {
      res.status(500).send('Network error')
      return
    } else {
      res.status(500).send('Internal Server Error')
    }
  }
}
