import React from 'react'
import { Box, BoxProps } from '@island.is/island-ui/core'

interface MainProps {
  addLandmark?: boolean
  addId?: boolean
}

export const Main: React.FC<MainProps> = ({
  addLandmark = true,
  addId = true,
  children,
}) => {
  const boxProps: BoxProps = addLandmark
    ? {
        component: 'main',
        tabIndex: -1,
        outline: 'none',
      }
    : {}
  const boxId =
    addLandmark && addId
      ? {
          id: 'main-content',
        }
      : {}
  return (
    <Box {...boxProps} {...boxId}>
      {children}
    </Box>
  )
}
