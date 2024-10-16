import { NextApiRequest, NextApiResponse } from 'next'
import initApollo from '../../graphql/client'
import { SUB_GET_CASES } from '../../graphql/queries.graphql'
import RSS from 'rss'
import { SubGetCasesQuery } from '../../graphql/queries.graphql.generated'
import { SUB_PAGE_SIZE, SUB_STATUSES_TO_FETCH } from '../../utils/consts/consts'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = initApollo()
  try {
    const [casesResult] = await Promise.all([
      client.query<SubGetCasesQuery>({
        query: SUB_GET_CASES,
        variables: {
          input: {
            caseStatuses: SUB_STATUSES_TO_FETCH,
            pageSize: SUB_PAGE_SIZE,
          },
        },
      }),
    ])

    const {
      data: { consultationPortalGetCases },
    } = casesResult

    if (!consultationPortalGetCases) {
      res.status(500).send('No subscriptions found')
      return
    }

    const host: string = req.headers.host
    const protocol = `http${host.startsWith('localhost') ? '' : 's'}://`
    const baseUrl = `${protocol}${host}`

    const feed = new RSS({
      title: 'Samráðsgátt - RSS Feed',
      description: 'Áskrift af málum',
      language: 'is',
      feed_url: `${baseUrl}/samradsgatt/api/rss`,
      site_url: `${baseUrl}/samradsgatt`,
      copyright: `Allur réttur áskilinn ${new Date().getFullYear()}, Island.is`,
    })

    consultationPortalGetCases.cases.forEach((post) => {
      feed.item({
        title: post.name,
        description: '',
        url: `${baseUrl}/samradsgatt/mal/${post.id}`,
        date: '',
        custom_elements: [
          { caseNumber: post.caseNumber },
          { institutionName: post.institutionName },
          { policyAreaName: post.policyAreaName },
        ],
      })
    })

    const rss = feed.xml({ indent: true })
    res.setHeader('Content-Type', 'application/xml')
    res.status(200).send(rss)
  } catch (error) {
    if (error.networkError) {
      res.status(500).send('Network error')
    }
    res.status(500).send(`Internal Server Error: ${error.message}`)
  }
}
