import {
  useApolloClient,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client'
import { useUserInfo } from '@island.is/react-spa/bff'

export const useModuleProps = () => {
  const userInfo = useUserInfo()
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>

  if (userInfo === null) {
    throw new Error('Missing userInfo')
  }

  return {
    userInfo,
    client,
  }
}
