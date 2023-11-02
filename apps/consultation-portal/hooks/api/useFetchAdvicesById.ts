import { useQuery } from '@apollo/client'
import { CASE_GET_ADVICES_BY_ID } from '../../graphql/queries.graphql'

interface Props {
  caseId: number
}

export const useFetchAdvicesById = ({ caseId }: Props) => {
  const { data, loading, refetch } = useQuery(CASE_GET_ADVICES_BY_ID, {
    ssr: false,
    fetchPolicy: 'cache-and-network',
    skip: caseId ? false : true,
    variables: {
      input: {
        caseId: caseId,
      },
    },
  })

  const { consultationPortalAdviceByCaseId: advices = [] } = data ?? {}

  return {
    advices,
    advicesLoading: loading,
    refetchAdvices: refetch,
  }
}

export default useFetchAdvicesById
