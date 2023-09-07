import Cookie from 'js-cookie'
import { setContext } from '@apollo/client/link/context'

import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'

export default setContext((_, { headers }) => {
  const token = Cookie.get(CSRF_COOKIE_NAME)

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})
