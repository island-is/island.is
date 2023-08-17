import { useRouter } from 'next/router'
import { signIn } from 'next-auth/client'

export const useLogIn = () => {
  const router = useRouter()
  const path = router.basePath + router.asPath

  const LogIn = async () => {
    if (typeof window !== 'undefined') {
      history.pushState({}, '', path)
      signIn('identity-server', { callbackUrl: path, redirect: false })
    }
  }

  return LogIn
}

export default useLogIn
