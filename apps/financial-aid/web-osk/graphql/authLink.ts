import { setContext } from '@apollo/client/link/context'
import { getSession } from 'next-auth/client'

export default setContext(async (_, { headers }) => {
  const session = await getSession()

  return {
    headers: {
      ...headers,
      authorization: session?.accessToken
        ? `Bearer ${session.accessToken}`
        : '',
    },
  }
})
