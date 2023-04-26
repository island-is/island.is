import { SubscriptionViewmodel } from '@island.is/consultation-portal/types/viewmodel'
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

  const casesVM = SubscriptionViewmodel(cases)
  const institutionsVM = SubscriptionViewmodel(institutions)
  const policyAreasVM = SubscriptionViewmodel(policyAreas)

  return {
    casesVM,
    institutionsVM,
    policyAreasVM,
    subscribedToAll,
    subscribedToAllNew,
    getUserSubsLoading: loading,
  }
}
