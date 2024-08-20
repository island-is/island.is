import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export const useLogIn = () => {
  const router = useRouter()
  const path = `${router.basePath}${router.asPath}`

  const LogIn = async () => {
    if (typeof window !== 'undefined') {
      history.pushState({}, '', path)
      await signIn('identity-server', { callbackUrl: path, redirect: false })
    }
  }

  return LogIn
}

export default useLogIn
