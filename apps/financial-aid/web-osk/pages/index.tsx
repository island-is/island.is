import { Routes } from '@island.is/financial-aid/shared/lib'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { UserContext } from '../src/components/UserProvider/UserProvider'

const Index = () => {
  const { isAuthenticated } = useContext(UserContext)
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
