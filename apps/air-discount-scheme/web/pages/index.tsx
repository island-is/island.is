import '@island.is/api/mocks'
import { withLocale } from '../i18n'
import { Home } from '../screens'

import { User } from './auth/interfaces'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { AppContext } from '../components/AppProvider'


const Index = () => {
  const { isAuthenticated, user } = useContext(AppContext)
  const router = useRouter()
  useEffect(() => {
    document.title = 'Loftbrú þjónustusíða'
  }, [])

  const returnUrl = (user: User) => {
    return `/min-rettindi`
  }

  if (isAuthenticated && user) {
    router.push(returnUrl(user))
  }

  return null
}

//export default Index

export default withLocale('is', 'home')(Home)
