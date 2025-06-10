import { GetServerSideProps } from 'next'
import omit from 'lodash/omit'

import initApollo from '../../graphql/client'
import { GetJwksQuery } from '../../graphql/queries.graphql.generated'
import { GetJwks } from '../../graphql/queries.graphql'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'application/json')

  const client = initApollo()

  try {
    const { data, errors } = await client.query<GetJwksQuery>({
      query: GetJwks,
    })

    if (errors) {
      console.error('[JWKS] GraphQL errors:', errors)
      res.statusCode = 503
      res.write(
        JSON.stringify({
          error: 'Failed to retrieve JWKS data',
          message: 'Service temporarily unavailable',
        }),
      )
      res.end()
      return { props: {} }
    }

    res.write(
      JSON.stringify({
        keys: data.paymentsGetJwks.keys.map((k) => omit(k, ['__typename'])),
      }),
    )
    res.end()

    return { props: {} }
  } catch (e) {
    console.error('[JWKS] Unexpected error:', e)
    res.statusCode = 503
    res.write(JSON.stringify({ error: 'Unknown error occurred' }))
    res.end()
    return { props: {} }
  }
}

export default function JwksPage() {
  return null
}
