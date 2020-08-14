import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import LoadingBar from 'react-top-loading-bar'
import { theme } from '@island.is/island-ui/theme'

export const PageLoader = () => {
  const router = useRouter()
  const ref = useRef(null)
  theme

  useEffect(() => {
    const start = () => {
      ref.current.continuousStart()
    }
    const done = () => {
      ref.current.complete()
    }
    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', done)
    router.events.on('routeChangeError', done)

    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', done)
      router.events.off('routeChangeError', done)
    }
  }, [])

  return <LoadingBar color={theme.color.red400} ref={ref} />
}

export default PageLoader
