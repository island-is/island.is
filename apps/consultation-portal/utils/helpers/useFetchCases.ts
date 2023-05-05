import { useQuery } from '@apollo/client'
import initApollo from '../../graphql/client'
import { HOME_GET_CASES } from '../../graphql/queries.graphql'
import { CaseFilter, FetchCasesInput } from '../../types/interfaces'

interface Props {
  input: FetchCasesInput
}

export const useFetchCases = ({ input }: Props) => {
  const client = initApollo()
  const { data, loading, refetch } = useQuery(HOME_GET_CASES, {
    client: client,
    ssr: false,
    fetchPolicy: 'network-only',
    variables: {
      input,
    },
  })

  const { consultationPortalGetCases: casesData = [] } = data ?? {}

  const { cases = [], filterGroups = {}, total = 0 } = casesData

  return {
    cases,
    filterGroups,
    total,
    getCasesLoading: loading,
    refetchCases: refetch,
  }
}

export default useFetchCases
