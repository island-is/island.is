import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { LoadingBarRef } from 'react-top-loading-bar'
import { PageLoader as PageLoaderUI } from '@island.is/island-ui/core'

export const PageLoader = () => {
  const router = useRouter()
  const ref = useRef<LoadingBarRef>(null)

  useEffect(() => {
    const start = () => {
      ref?.current?.continuousStart()
    }
    const done = () => {
      ref.current?.complete()
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

  return <PageLoaderUI ref={ref} />
}

export default PageLoader
