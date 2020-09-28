import React, { ElementType, useState } from 'react'
import { Box, ResponsiveSpace } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'

type BackgroundBleed = {
  fromColor: keyof typeof theme.color
  toColor: keyof typeof theme.color
  bleedDirection: 'top' | 'bottom'
  bleedAmount: number
}

interface SectionProps {
  as?: ElementType
  paddingY?: ResponsiveSpace
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  background?: keyof typeof theme.color
  backgroundBleed?: BackgroundBleed
}

export const Section: React.FC<SectionProps> = ({
  as = 'section',
  children,
  paddingY,
  paddingTop,
  paddingBottom,
  background,
  backgroundBleed,
}) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const generateBackgroundBleed = () => {
    //Background bleed is not available on mobile.
    if (!backgroundBleed || isMobile) {
      return null
    }

    return {
      backgroundImage: `linear-gradient(to ${backgroundBleed.bleedDirection}, ${
        theme.color[backgroundBleed.fromColor]
      } calc(100% - ${backgroundBleed.bleedAmount}px), ${
        theme.color[backgroundBleed.toColor]
      } calc(100% - ${backgroundBleed.bleedAmount}px))`,
    }
  }

  return (
    <Box
      component={as as ElementType}
      paddingY={paddingY}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      background={background}
      style={generateBackgroundBleed()}
    >
      {children}
    </Box>
  )
}

export default Section
