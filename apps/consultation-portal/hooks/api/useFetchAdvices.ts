import { AdviceFilter } from '../../types/interfaces'
import { ADVICES_GET_ALL_USER_ADVICES } from '../../graphql/queries.graphql'
import { useQuery } from '@apollo/client'

interface Props {
  input: AdviceFilter
  isAuthenticated: boolean
}

export const useFetchAdvices = ({ input, isAuthenticated }: Props) => {
  const { data, loading } = useQuery(ADVICES_GET_ALL_USER_ADVICES, {
    ssr: false,
    fetchPolicy: 'network-only',
    skip: !isAuthenticated,
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
