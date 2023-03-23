import { useRouter } from 'next/router'
import { useState } from 'react'
import getAuthUrl from './getAuthUrl'

export const useLogin = () => {
  const router = useRouter()
  const { authUrl, authUrlLoading } = getAuthUrl()
  const [loginLoading, setIsLoginLoading] = useState(false)

  let authUrlSliced = ''
  if (!authUrlLoading && authUrl) {
    const path = router.basePath + router.asPath
    localStorage.setItem('pathname', path)
    authUrlSliced = authUrl.slice(1, -1)
  }

  const LogIn = () => {
    setIsLoginLoading(true)
    if (authUrlSliced) {
      window.location.href = authUrlSliced
    } else {
      setIsLoginLoading(false)
    }
  }

  return { LogIn, loginLoading }
}

export default useLogin
