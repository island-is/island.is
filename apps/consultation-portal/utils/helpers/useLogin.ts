import { useRouter } from 'next/router'
import { signIn } from 'next-auth/client'

export const useLogIn = () => {
  const router = useRouter()
  const path = router.basePath + router.asPath

  const LogIn = async () => {
    if (typeof window !== 'undefined') {
      signIn('identity-server', { callbackUrl: path })
    }
  }

  return LogIn
}

export default useLogIn
