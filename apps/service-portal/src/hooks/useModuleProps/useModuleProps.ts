import {
  useApolloClient,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client'
import { useAuth } from '@island.is/auth/react'

export const useModuleProps = () => {
  const { userInfo } = useAuth()
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>

  return {
    userInfo,
    client,
  }
}
