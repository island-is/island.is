import { NextApiRequest } from 'next'
import initApollo from '../../graphql/client'
import { SUB_GET_CASES } from '../../graphql/queries.graphql'
import { SubGetCasesQuery } from '../../graphql/queries.graphql.generated'
import { SUB_PAGE_SIZE, SUB_STATUSES_TO_FETCH } from '../../utils/consts/consts'

type CaseItem = {
  id?: number | null
  caseNumber?: string | null
  name?: string | null
  institutionName?: string | null
  policyAreaName?: string | null
}

export default async function handler(req: NextApiRequest, res) {
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

    const host: string = req.headers.host
    const protocol = `http${host.startsWith('localhost') ? '' : 's'}://`
    const baseUrl = `${protocol}${host}`

    const getCases = (post: CaseItem) => {
      return `<item>
          <title>${post.name}</title>
          <description>${post.name}</description>
          <link>${baseUrl}/samradsgatt/mal/${post.id}</link>
        </item>`
    }

    const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Samráðsgátt - Áskriftir RSS Veita</title>
        <description>Island.is</description>
        ${consultationPortalGetCases.cases.map((i) => getCases(i)).join('')}
      </channel>
    </rss>`

    res.set('Content-Type', 'text/xml;charset=UTF-8')
    return res.status(200).send(feed)
  } catch (error) {
    if (error.networkError) {
      res.status(500).send('Network error')
      return
    } else {
      res.status(500).send('Internal Server Error')
    }
  }
}
