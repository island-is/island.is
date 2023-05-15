import initApollo from '../../graphql/client'
import { SUB_GET_USERSUBS } from '../../graphql/queries.graphql'
import { useQuery } from '@apollo/client'

interface Props {
  isAuthenticated: boolean
}

export const useFetchSubscriptions = ({ isAuthenticated }: Props) => {
  const client = initApollo()

  const { data, loading, refetch } = useQuery(SUB_GET_USERSUBS, {
    client: client,
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
