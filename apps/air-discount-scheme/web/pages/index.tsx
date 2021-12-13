import '@island.is/api/mocks'
import { useSession } from 'next-auth/client'
import { withLocale } from '../i18n'
import { Home } from '../screens'

export default withLocale('is', 'home')(Home)//IndexHome 

// import { useRouter } from 'next/router'
// import { useContext, useEffect } from 'react'
// import { AuthContext } from '@island.is/air-discount-scheme-web/components'
// import { signIn, useSession } from 'next-auth/client'
// import initApollo from './'


// const Index = () => {
//   const [session, loading] = useSession()
//   const { isAuthenticated, user } = useContext(AuthContext)
  
//   const router = useRouter()
//   useEffect(() => {
//     document.title = 'MIN Loftbru'
//   }, [])

//   // if(!session){
//   //   signIn('identity-provider', {callbackUrl: 'http://localhost:4200'})
//   // }

//   const returnUrl = () => {
//     return `/min-rettindi`
//   }

//   if (isAuthenticated && user) {
//     router.push(returnUrl())
//   }

//   return withLocale('is', 'home')(Home)
// }

// export default (Index)
