import { useStore } from '../../store/stateProvider'
import {
  useApolloClient,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client'

export const useModuleProps = () => {
  const [{ userInfo }] = useStore()
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>

  return {
    userInfo,
    client,
  }
}
