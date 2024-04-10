import { NextApiResponse } from 'next/types'
import { NormalizedCacheObject } from '@apollo/client/cache/inmemory/types'
import { ApolloClient } from '@apollo/client/core/ApolloClient'

import { GetUniversityGatewayProgramsQuery } from '@island.is/web/graphql/schema'

import { GET_UNIVERSITY_GATEWAY_PROGRAM_LIST_IDS } from '../queries/UniversityGateway'

const Sitemap = () => null

Sitemap.getProps = async ({
  apolloClient,
  res,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>
  res: NextApiResponse
}) => {
  const { data } = await apolloClient.query<GetUniversityGatewayProgramsQuery>({
    query: GET_UNIVERSITY_GATEWAY_PROGRAM_LIST_IDS,
  })

  const programUrls = data.universityGatewayPrograms.data.map((item) => {
    return [
      `https://island.is/haskolanam/${item.id}`,
      `https://island.is/en/university-studies/${item.id}`,
    ]
  })

  // Generate sitemap content
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${programUrls
          .map((urls) => {
            return `
            <url>
              <changefreq>weekly</changefreq>
              <loc>${urls[0]}</loc>
            </url>
            <url>
              <changefreq>weekly</changefreq>
              <loc>${urls[1]}</loc>
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
