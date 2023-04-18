import initApollo from '../../graphql/client'
import { AdviceFilter } from '../../types/interfaces'
import { ADVICES_GET_ALL_USER_ADVICES } from '../../graphql/queries.graphql'
import { useQuery } from '@apollo/client'

interface Props {
  input: AdviceFilter
}

export const useFetchAdvices = ({ input }: Props) => {
  const client = initApollo()
  const { data, loading } = useQuery(ADVICES_GET_ALL_USER_ADVICES, {
    client: client,
    ssr: false,
    fetchPolicy: 'network-only',
    variables: {
      input,
    },
  })

  const { consultationPortalAllUserAdvices: advicesData = [] } = data ?? {}

  const { advices = [], total = 0 } = advicesData

  return {
    advices,
    total,
    getAdvicesLoading: loading,
  }
}
