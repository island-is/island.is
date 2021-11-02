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
    if (user?.isSpouse?.hasFiles) {
      return `${Routes.statusPage(user.currentApplicationId as string)}`
    }
    if (user?.isSpouse?.hasApplied) {
      return `${Routes.spouseApplication}`
    }

    if (user?.currentApplicationId) {
      return `${Routes.statusPage(user.currentApplicationId as string)}`
    }

    return `${Routes.application}`
  }

  if (isAuthenticated && user) {
    router.push(returnUrl(user))
  }

  return null
}

export default Index
