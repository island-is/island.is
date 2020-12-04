import React, { useRef } from 'react'
import { Box, BoxProps } from '@island.is/island-ui/core'

export const Main: React.FC = ({ children }) => {
  const mainRef = useRef<HTMLDivElement>(null)
  const shouldAddLandmark = !mainRef?.current?.querySelectorAll('#main-content')
    .length
  const boxProps: BoxProps = shouldAddLandmark
    ? {
        component: 'main',
        id: 'main-content',
        tabIndex: -1,
      }
    : {}
  return (
    <Box ref={mainRef} {...boxProps}>
      {children}
    </Box>
  )
}
