import { setContext } from '@apollo/client/link/context'
import { getAccessToken } from './getAccessToken'

export const authLink = setContext(async (_, { headers }) => {
  const token = await getAccessToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
