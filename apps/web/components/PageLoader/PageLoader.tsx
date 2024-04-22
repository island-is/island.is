import React, { useEffect, useRef } from 'react'
import { LoadingBarRef } from 'react-top-loading-bar'
import { useRouter } from 'next/router'

import { PageLoader as PageLoaderUI } from '@island.is/island-ui/core'

type RouteChangeFunction = (url: string, props: { shallow: boolean }) => void

export const PageLoader = () => {
  const router = useRouter()
  const ref = useRef<LoadingBarRef>(null)
  const state = useRef<'idle' | 'loading'>('idle')

  useEffect(() => {
    const onStart: RouteChangeFunction = (_, { shallow }) => {
      if (!shallow) {
        state.current = 'loading'
        ref.current?.continuousStart()
      }
    }
    const onComplete: RouteChangeFunction = (_, { shallow }) => {
      if (!shallow) {
        state.current = 'idle'
        ref.current?.complete()
      }
    }
    const onError = () => {
      if (state.current === 'loading') {
        ref.current?.complete()
        state.current = 'idle'
      }
    }

    router.events.on('routeChangeStart', onStart)
    router.events.on('routeChangeComplete', onComplete)
    router.events.on('routeChangeError', onError)

    return () => {
      router.events.off('routeChangeStart', onStart)
      router.events.off('routeChangeComplete', onComplete)
      router.events.off('routeChangeError', onError)
    }
  }, [router.events])

  return <PageLoaderUI ref={ref} />
}

export default PageLoader
