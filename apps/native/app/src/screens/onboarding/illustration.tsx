import { dynamicColor } from '@island.is/island-ui-native'
import { theme } from '@island.is/island-ui/theme'
import React from 'react'
import { DynamicColorIOS, Image, Platform } from 'react-native'
import styled from 'styled-components/native'
import illustrationSrc from '../../assets/illustrations/digital-services-m1.png'
import gridDotSrc from '../../assets/illustrations/grid-dot.png'

const Host = styled.SafeAreaView`
  background-color: ${dynamicColor((props) => ({
    light: props.theme.color.blue100,
    dark: props.theme.shades.dark.background,
  }))};
  height: 400px;
  max-height: 40%;
  align-items: center;
`

const DotGrid = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: -42px;
  padding: 16px;
`

export function Illustration() {
  return (
    <Host>
      <DotGrid>
        <Image
          source={gridDotSrc}
          style={{
            width: '100%',
            height: '100%',
            tintColor: Platform.select({
              ios: DynamicColorIOS({
                light: theme.color.blue200,
                dark: 'rgba(204, 223, 255, 0.20)',
              }),
              android: theme.color.blue200 as any,
            }),
          }}
          resizeMode="repeat"
        />
      </DotGrid>
      <Image
        source={illustrationSrc}
        resizeMode="contain"
        style={{
          width: '100%',
          height: '100%',
          marginTop: -16,
          marginLeft: 32,
        }}
      />
    </Host>
  )
}
