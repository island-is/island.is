import React, { ForwardedRef, forwardRef } from 'react'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'
import { theme } from '@island.is/island-ui/theme'

const colorGradiant = `linear-gradient(90deg,
    ${theme.color.blue400} 0%,
    ${theme.color.blue600} 25%,
    ${theme.color.purple400} 50%,
    ${theme.color.roseTinted400} 75%,
    ${theme.color.red400} 100%
  )`

export const PageLoader = forwardRef(
  (_props, ref: ForwardedRef<LoadingBarRef>) => {
    return <LoadingBar color={colorGradiant} ref={ref} />
  },
)
