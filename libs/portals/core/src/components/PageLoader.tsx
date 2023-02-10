import React, { useEffect, useRef } from 'react'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'
import { theme } from '@island.is/island-ui/theme'
import { useNavigation } from 'react-router-dom'

export const PageLoader = () => {
  const { state } = useNavigation()
  const ref = useRef<LoadingBarRef>(null)

  useEffect(() => {
    if (state === 'loading') {
      ref.current?.continuousStart()
    } else if (state === 'idle') {
      ref.current?.complete()
    }
  }, [state])

  const colorGradiant = `linear-gradient(90deg,
    ${theme.color.blue400} 0%,
    ${theme.color.blue600} 25%,
    ${theme.color.purple400} 50%,
    ${theme.color.roseTinted400} 75%,
    ${theme.color.red400} 100%
  )`

  return <LoadingBar color={colorGradiant} ref={ref} />
}
