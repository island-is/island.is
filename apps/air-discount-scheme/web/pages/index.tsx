// import '@island.is/api/mocks'
import { withLocale } from '../i18n'
// import { Home } from '../screens'

// export default withLocale('is', 'home')(Home)

import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { AuthContext } from '@island.is/air-discount-scheme-web/components'
import { signIn, useSession } from 'next-auth/client'

const Index = () => {
  const { isAuthenticated, user } = useContext(AuthContext)
  const [session, loading] = useSession()
  const router = useRouter()
  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  // if(!session){
  //   signIn('identity-provider', {callbackUrl: 'http://localhost:4200'})
  // }

  const returnUrl = () => {
    return `/min-rettindi`
  }

  if (isAuthenticated && user) {
    router.push(returnUrl())
  }

  return null
}

export default withLocale('is', 'home')(Index)
