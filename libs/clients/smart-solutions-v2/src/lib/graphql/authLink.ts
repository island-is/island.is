import { setContext } from '@apollo/client/link/context'

export const authLink = (apiKey: string) =>
  setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        'X-API-KEY': apiKey,
      },
    }
  })
