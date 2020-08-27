import { useStore } from '../../store/stateProvider'
import {
  useApolloClient,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client'
import { ServicePortalModuleProps } from '@island.is/service-portal/core'

export const useModuleProps = (): ServicePortalModuleProps => {
  const [{ userInfo }] = useStore()
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>

  return {
    userInfo,
    client,
  }
}
