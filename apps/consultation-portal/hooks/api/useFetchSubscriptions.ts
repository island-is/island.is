import { useQuery } from '@apollo/client'
import { SUB_GET_USERSUBS } from '../../graphql/queries.graphql'

interface Props {
  isAuthenticated: boolean
}

export const useFetchSubscriptions = ({ isAuthenticated }: Props) => {
  const { data, loading, refetch } = useQuery(SUB_GET_USERSUBS, {
    ssr: false,
    fetchPolicy: 'network-only',
    skip: !isAuthenticated,
  })

  const { consultationPortalUserSubscriptions: userSubscriptions = [] } =
    data ?? {}

  return {
    userSubscriptions,
    getUserSubsLoading: loading,
    refetchUserSubs: refetch,
  }
}
