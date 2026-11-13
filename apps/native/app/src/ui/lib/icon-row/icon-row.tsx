import React from 'react'
import { ImageSourcePropType, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Icon } from '../icon/icon'
import { Typography, variants } from '../typography/typography'

const ICON_SIZE = 16

const Host = styled.View`
  flex-direction: row;
  align-items: flex-start;
  column-gap: ${({ theme }) => theme.spacing[1]}px;
`

type IconRowProps = {
  icon: ImageSourcePropType
  children: React.ReactNode
}

// An icon in front of body text. The icon is centred on the first line, so
// text that wraps stays clear of it.
export function IconRow({ icon, children }: IconRowProps) {
  const theme = useTheme()

  return (
    <Host>
      <Icon
        source={icon}
        width={ICON_SIZE}
        height={ICON_SIZE}
        tintColor={theme.tokens.foreground.brand}
        resizeMode="contain"
        style={{ marginTop: (variants.body.lineHeight - ICON_SIZE) / 2 }}
      />
      <View style={{ flex: 1 }}>
        <Typography variant="body">{children}</Typography>
      </View>
    </Host>
  )
}
