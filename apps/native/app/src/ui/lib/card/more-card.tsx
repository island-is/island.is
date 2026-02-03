import React from 'react'
import { Image, ImageSourcePropType, TouchableHighlight, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.View<{ small?: boolean, filled?: boolean }>`
  display: flex;
  flex: 1;
  background-color: ${({ theme, filled }) => filled ? theme.color.blue100 : 'transparent'};
  padding: ${({ theme, small }) => small ? theme.spacing[1] : theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
  ({ theme, filled }) => filled ? 'transparent' : ({
    light: theme.color.blue200,
    dark: theme.shades.dark.shade300,
  }),
  true,
)};
  align-items: center;
  justify-content: center;
`

const Title = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  text-align: center;
`

interface AssetCardProps {
  title: string
  icon: ImageSourcePropType
  onPress: () => void
  small?: boolean
  filled?: boolean
  style?: ViewStyle
}

export const MoreCard = ({ icon, title, onPress, small = false, filled = false, style }: AssetCardProps) => {
  const theme = useTheme()
  return (
    <TouchableHighlight
      underlayColor={
        theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
      }
      style={[{ flex: 1, minHeight: small ? 70 : 90 }, style]}
      onPress={onPress}
    >
      <Host small={small} filled={filled}>
        <Image source={icon} style={{ width: 24, height: 24 }} />
        <Title ellipsizeMode='tail' numberOfLines={1} variant={small ? 'body3' : 'body'}>{title}</Title>
      </Host>
    </TouchableHighlight>
  )
}
