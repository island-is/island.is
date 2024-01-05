import { useQuery } from '@apollo/client'
import { HOME_GET_STATISTICS } from '../../graphql/queries.graphql'

export const useFetchStatistics = () => {
  const { data } = useQuery(HOME_GET_STATISTICS, {
    ssr: false,
    fetchPolicy: 'cache-first',
  })

  const { consultationPortalStatistics: statistics = {} } = data ?? {}

  return { statistics }
}
