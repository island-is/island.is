import { setContext } from '@apollo/client/link/context'
import { getSession } from 'next-auth/react'

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
