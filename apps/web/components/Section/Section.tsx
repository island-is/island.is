import React, { ElementType } from 'react'
import { useWindowSize } from 'react-use'

import { Box, ResponsiveSpace } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

type BackgroundBleed = {
  fromColor: keyof typeof theme.color
  toColor: keyof typeof theme.color
  bleedDirection: 'top' | 'bottom'
  bleedAmount: number
  mobileBleedAmount?: number
}

interface SectionProps {
  as?: ElementType
  paddingY?: ResponsiveSpace
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  background?: keyof typeof theme.color
  backgroundBleed?: BackgroundBleed
}

export const Section: React.FC<React.PropsWithChildren<SectionProps>> = ({
  as = 'section',
  children,
  paddingY,
  paddingTop,
  paddingBottom,
  background,
  backgroundBleed,
  ...rest
}) => {
  const { width } = useWindowSize()

  const hasMobileBleedAmount = (backgroundBleed?.mobileBleedAmount ?? -1) >= 0
  const hasBleedAmount =
    (backgroundBleed?.bleedAmount ?? -1) >= 0 || hasMobileBleedAmount

  const generateBackgroundBleed = () => {
    if (hasBleedAmount && backgroundBleed) {
      const amount =
        hasMobileBleedAmount && width < theme.breakpoints.md
          ? backgroundBleed.mobileBleedAmount
          : backgroundBleed.bleedAmount

      return {
        backgroundImage: `linear-gradient(to ${
          backgroundBleed?.bleedDirection
        }, ${
          theme.color[backgroundBleed.fromColor]
        } calc(100% - ${amount}px), ${
          theme.color[backgroundBleed.toColor]
        } calc(100% - ${amount}px))`,
      }
    }
  }

  return (
    <Box
      component={as as ElementType}
      paddingY={paddingY}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      background={background}
      {...(hasBleedAmount && {
        style: generateBackgroundBleed(),
      })}
      {...rest}
    >
      {children}
    </Box>
  )
}

export default Section
