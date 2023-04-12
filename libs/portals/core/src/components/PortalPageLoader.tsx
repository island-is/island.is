import React, { useEffect, useRef } from 'react'
import { LoadingBarRef } from 'react-top-loading-bar'
import { useNavigation } from 'react-router-dom'
import { PageLoader } from '@island.is/island-ui/core'

export const PortalPageLoader = () => {
  const { state } = useNavigation()
  const ref = useRef<LoadingBarRef>(null)

  useEffect(() => {
    if (state === 'loading') {
      ref.current?.continuousStart()
    } else if (state === 'idle') {
      ref.current?.complete()
    }
  }, [state])

  return <PageLoader ref={ref} />
}
