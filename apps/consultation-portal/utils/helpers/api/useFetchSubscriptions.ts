import initApollo from '../../../graphql/client'
import { SUB_GET_USERSUBS } from '../../../graphql/queries.graphql'
import { useQuery } from '@apollo/client'

export const useFetchSubscriptions = () => {
  const client = initApollo()
  const { data, loading } = useQuery(SUB_GET_USERSUBS, {
    client: client,
    ssr: false,
    fetchPolicy: 'network-only',
  })

  const { consultationPortalUserSubscriptions: userSubscriptions = [] } =
    data ?? {}
  const {
    cases = [],
    institutions = [],
    policyAreas = [],
    subscribedToAll = false,
    subscribedToAllNew = false,
  } = userSubscriptions
  return {
    cases,
    institutions,
    policyAreas,
    subscribedToAll,
    subscribedToAllNew,
    getUserSubsLoading: loading,
  }
}
