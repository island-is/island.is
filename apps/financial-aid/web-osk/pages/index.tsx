import { Routes } from '@island.is/financial-aid/shared/lib'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const Index = () => {
  const { isAuthenticated } = useContext(AppContext)
  const router = useRouter()
  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  if (isAuthenticated) {
    router.push(Routes.application)
  }

  return null
}

export default Index
