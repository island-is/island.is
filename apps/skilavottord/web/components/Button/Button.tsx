import React, { useEffect, useState } from 'react'
import { ButtonDeprecated as IslandUIButton } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

export const Button = (props) => {
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <IslandUIButton {...props} width={isMobile ? 'fluid' : 'normal'}>
      {props.children}
    </IslandUIButton>
  )
}

export default Button
