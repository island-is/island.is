import {
  useApolloClient,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client'
import { useAuth } from '@island.is/auth/react'

export const useModuleProps = () => {
  const { userInfo } = useAuth()
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>

  if (userInfo === null) {
    throw new Error('Missing userInfo')
  }

  return {
    userInfo,
    client,
  }
}
