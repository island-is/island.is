import { useQuery } from '@apollo/client'
import initApollo from '../../graphql/client'
import { HOME_GET_STATISTICS } from '../../graphql/queries.graphql'

export const useFetchStatistics = () => {
  const client = initApollo()
  const { data } = useQuery(HOME_GET_STATISTICS, {
    client: client,
    ssr: false,
    fetchPolicy: 'cache-first',
  })

  const { consultationPortalStatistics: statistics = {} } = data ?? {}

  return { statistics }
}
