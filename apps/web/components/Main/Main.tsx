import React, { useRef } from 'react'
import { Box, BoxProps } from '@island.is/island-ui/core'

interface MainProps {
  addLandmark?: boolean
}

export const Main: React.FC<MainProps> = ({ addLandmark = true, children }) => {
  const mainRef = useRef<HTMLDivElement>(null)
  const shouldAddLandmark =
    addLandmark && !mainRef?.current?.querySelectorAll('main').length
  const shouldAddId = !mainRef?.current?.querySelectorAll('#main-content')
    .length
  const boxProps: BoxProps = shouldAddLandmark
    ? {
        component: 'main',
        tabIndex: -1,
        outline: 'none',
      }
    : {}
  const boxId =
    shouldAddLandmark && shouldAddId
      ? {
          id: 'main-content',
        }
      : {}
  return (
    <Box ref={mainRef} {...boxProps} {...boxId}>
      {children}
    </Box>
  )
}
