import { useRouter } from 'next/router'
import { Routes } from '@island.is/financial-aid/shared/lib'

const Index = () => {
  const router = useRouter()
  router.replace(Routes.application)
  return null
}

export default Index
