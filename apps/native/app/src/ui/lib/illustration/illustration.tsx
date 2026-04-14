import React from 'react'
import { DynamicColorIOS, Image, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import illustrationSrc from '../../assets/illustrations/digital-services-m1.png'
import gridDotSrc from '../../assets/illustrations/grid-dot.png'
import { dynamicColor } from '../../utils'
import { SafeAreaView } from 'react-native-safe-area-context'

const Host = styled.SafeAreaView<{ isBottom: boolean }>`
  background-color: ${dynamicColor((props) => ({
    light: props.theme.color.blue100,
    dark: props.theme.shades.dark.background,
  }))};
  height: ${({ isBottom }) => (isBottom ? '360px' : '400px')};
  max-height: 50%;
  align-items: center;
  ${({ isBottom }) => isBottom && 'margin-bottom: -32px'};
`

const DotGrid = styled.View<{ isBottom: boolean }>`
  position: absolute;
  top: ${({ isBottom }) => (isBottom ? '8px' : '-0')};
  bottom: ${({ isBottom }) => (isBottom ? '0' : '-42px')};
  left: 0px;
  right: 0px;
  padding: 16px;
`

const IllustrationImage = styled.Image<{ isBottom: boolean }>`
  width: 100%;
  height: 100%;
  margin-top: ${({ isBottom }) => (isBottom ? '48px' : '-16px')};
  margin-left: 32px;
`

interface IllustrationProps {
  isBottomAligned?: boolean
}

export function Illustration({ isBottomAligned = false }: IllustrationProps) {
  const theme = useTheme()
  return (
    <Host isBottom={isBottomAligned}>
      <DotGrid isBottom={isBottomAligned}>
        <Image
          source={gridDotSrc}
          style={{
            width: '100%',
            height: '100%',
            tintColor:
              Platform.OS === 'android'
                ? theme.color.blue200
                : DynamicColorIOS({
                    light: theme.color.blue200,
                    dark: 'rgba(204, 223, 255, 0.20)',
                  }),
          }}
          resizeMode="repeat"
        />
      </DotGrid>
      <IllustrationImage
        source={illustrationSrc}
        resizeMode="contain"
        isBottom={isBottomAligned}
      />
    </Host>
  )
}
