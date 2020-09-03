import React from 'react'
import { Box, ResponsiveSpace } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

type BackgroundBleed = {
  fromColor: keyof typeof theme.color
  toColor: keyof typeof theme.color
  bleedDirection: 'top' | 'bottom'
  bleedAmount: number
}

interface SectionProps {
  as?: string
  paddingY?: ResponsiveSpace
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  background?: keyof typeof theme.color
  backgroundBleed?: BackgroundBleed
}

const Section: React.FC<SectionProps> = ({
  as = 'section',
  children,
  paddingY,
  paddingTop,
  paddingBottom,
  background,
  backgroundBleed,
}) => {
  const generateBackgroundBleed = (backgroundBleed: BackgroundBleed) => {
    const { width } = useWindowSize()
    //Background bleed is not available on mobile.
    if (width < theme.breakpoints.md) {
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
      as={as}
      paddingY={paddingY}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      background={background}
      style={backgroundBleed && generateBackgroundBleed(backgroundBleed)}
    >
      {children}
    </Box>
  )
}

export default Section
