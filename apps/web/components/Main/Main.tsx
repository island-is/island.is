import React, { ReactNode, useRef } from 'react'
import { Box, BoxProps } from '@island.is/island-ui/core'

interface props {
  children?: ReactNode
}

export const Main: React.FC<props> = ({ children }) => {
  const mainRef = useRef<HTMLDivElement>(null)
  const shouldAddLandmark = !mainRef?.current?.querySelectorAll('#main-content')
    .length
  const boxProps: BoxProps = shouldAddLandmark
    ? {
        component: 'main',
        tabIndex: -1,
        outline: 'none',
      }
    : {}
  return (
    <Box ref={mainRef} {...boxProps}>
      {children}
    </Box>
  )
}
