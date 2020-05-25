import { setContext } from 'apollo-link-context'
import Cookie from 'js-cookie'

export const COOKIE_KEY = 'gjafakort.csrf'

export default setContext((_, { headers }) => {
  const token = Cookie.get(COOKIE_KEY)

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
