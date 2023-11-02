import { useQuery } from '@apollo/client'
import { CASE_GET_CASE_SUBSCRIPTION } from '../../graphql/queries.graphql'

interface Props {
  isAuthenticated: boolean
  caseId: number
}

export const useFetchCaseSubscription = ({
  isAuthenticated,
  caseId,
}: Props) => {
  const { data, loading, refetch } = useQuery(CASE_GET_CASE_SUBSCRIPTION, {
    ssr: false,
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
    skip: !isAuthenticated,
    variables: {
      input: {
        caseId: caseId,
      },
    },
  })

  const { consultationPortalSubscriptionType: caseSubscription = {} } =
    data ?? {}

  return {
    caseSubscription,
    caseSubscriptionLoading: loading,
    refetchCaseSubscription: refetch,
  }
}

export default useFetchCaseSubscription
