import { Routes, User } from '@island.is/financial-aid/shared/lib'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const Index = () => {
  const { isAuthenticated, user } = useContext(AppContext)
  const router = useRouter()
  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  const returnUrl = (user: User) => {
    if (user?.isSpouse) {
      return `${Routes.spouseApplication}`
    }

    if (user?.currentApplication) {
      return `${Routes.statusPage(user.currentApplication as string)}`
    }

    return `${Routes.application}`
  }

  if (isAuthenticated && user) {
    router.push(returnUrl(user))
  }

  return null
}

export default Index
