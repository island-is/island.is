import React, { ReactNode, useRef } from 'react'

import { Box, BoxProps } from '@island.is/island-ui/core'

export const Main: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const mainRef = useRef<HTMLDivElement>(null)
  const shouldAddLandmark =
    !mainRef?.current?.querySelectorAll('#main-content').length
  const boxProps: BoxProps = shouldAddLandmark
    ? {
        component: 'main',
        tabIndex: -1,
        outline: 'none',
        id: 'main-content',
        display: 'flex',
        flexGrow: 1,
      }
    : {}
  return (
    <Box ref={mainRef} {...boxProps}>
      {children}
    </Box>
  )
}
