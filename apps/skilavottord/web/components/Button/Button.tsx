import React from 'react'
import { Button as IslandUIButton } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

export const Button = (props) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  return (
    <IslandUIButton {...props} width={isMobile ? 'fluid' : 'normal'}>
      {props.children}
    </IslandUIButton>
  )
}

export default Button
