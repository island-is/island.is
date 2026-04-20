import { setContext } from '@apollo/client/link/context'
import { getSession } from 'next-auth/react'
import { AuthSession } from '@island.is/next-ids-auth'

export default setContext(async (_, { headers }) => {
  const session = await getSession()

  return {
    headers: {
      ...headers,
      authorization: (session as AuthSession)?.accessToken
        ? `Bearer ${(session as AuthSession)?.accessToken}`
        : '',
    },
  }
})
