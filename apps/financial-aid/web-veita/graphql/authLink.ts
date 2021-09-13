import { setContext } from '@apollo/client/link/context'
import { CSRF_COOKIE_NAME } from '@island.is/financial-aid/shared/lib'
import Cookie from 'js-cookie'

export default setContext((_, { headers }) => {
  const token = Cookie.get(CSRF_COOKIE_NAME)

  if (token) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    }
  }

  return headers
})
