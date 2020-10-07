import { setContext } from '@apollo/client/link/context'
import Cookie from 'js-cookie'

import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/skilavottord/consts'

export default setContext((_, { headers }) => {
  const token = Cookie.get(ACCESS_TOKEN_COOKIE_NAME)

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
