import React from 'react'
import {
  Image,
  ImageSourcePropType,
  TouchableHighlight,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Typography } from '../typography/typography'

const Host = styled.View<{ small?: boolean; filled?: boolean }>`
  display: flex;
  flex: 1;
  padding: ${({ theme, small }) =>
    small ? theme.spacing[1] : theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${({ theme, filled }) =>
    filled ? 'transparent' : theme.tokens.border.primary};
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
  testID?: string
}

export const MoreCard = ({
  icon,
  title,
  onPress,
  small = false,
  filled = false,
  style,
  testID,
}: AssetCardProps) => {
  const theme = useTheme()
  return (
    <TouchableHighlight
      underlayColor={theme.tokens.app.background.pressed}
      activeOpacity={1}
      style={[
        {
          flex: 1,
          minHeight: small ? 70 : 90,
          borderRadius: 8,
          backgroundColor: filled
            ? theme.tokens.background.brandMinimal
            : undefined,
        },
        style,
      ]}
      testID={testID}
      onPress={onPress}
    >
      <Host small={small} filled={filled}>
        <Image source={icon} style={{ width: 24, height: 24 }} />
        <Title
          ellipsizeMode="tail"
          numberOfLines={1}
          variant={small ? 'body3' : 'body'}
        >
          {title}
        </Title>
      </Host>
    </TouchableHighlight>
  )
}
