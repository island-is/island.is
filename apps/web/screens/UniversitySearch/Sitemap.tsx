import { NextApiRequest, NextApiResponse } from 'next/types'
import { NormalizedCacheObject } from '@apollo/client/cache/inmemory/types'
import { ApolloClient } from '@apollo/client/core/ApolloClient'

import { Locale } from '@island.is/shared/types'
import { GetUniversityGatewayProgramsQuery } from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'

import { GET_UNIVERSITY_GATEWAY_PROGRAM_LIST_IDS } from '../queries/UniversityGateway'

const Sitemap = () => null

Sitemap.getProps = async ({
  apolloClient,
  res,
  req,
  locale,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>
  res: NextApiResponse
  req: NextApiRequest
  locale: Locale
}) => {
  const { data } = await apolloClient.query<GetUniversityGatewayProgramsQuery>({
    query: GET_UNIVERSITY_GATEWAY_PROGRAM_LIST_IDS,
  })

  const host = req.headers?.host ?? 'island.is'
  const protocol = `http${host?.startsWith('localhost') ? '' : 's'}://`
  const baseUrl = `${protocol}${host}`

  const programUrls = data.universityGatewayPrograms.data.map((item) => {
    return (
      baseUrl + linkResolver('universitysearchdetails', [item.id], locale).href
    )
  })

  // Generate sitemap content
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${programUrls
          .map((url) => {
            return `
            <url>
              <changefreq>weekly</changefreq>
              <loc>${url}</loc>
            </url>
          `
          })
          .join('')}
      </urlset>`

  // Set response headers
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap
