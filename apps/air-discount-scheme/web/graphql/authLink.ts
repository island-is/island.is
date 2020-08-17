import { setContext } from 'apollo-link-context'
import Cookie from 'js-cookie'

export default setContext((_, { headers }) => {
  const token = Cookie.get('gjafakort.csrf')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
