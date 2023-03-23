import { useQuery } from '@apollo/client'
import initApollo from '../../graphql/client'
import { GET_AUTH_URL } from '../../graphql/queries.graphql'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const useLogin = () => {
  const client = initApollo()
  const { data, loading } = useQuery(GET_AUTH_URL, {
    client: client,
    ssr: true,
    fetchPolicy: 'cache-first',
  })

  const { consultationPortalAuthenticationUrl: authUrl = '' } = data ?? ''

  const router = useRouter()
  const [loginLoading, setIsLoginLoading] = useState(false)

  let authUrlSliced = ''
  if (!loading && authUrl) {
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
