import React from 'react'
import { Image, ImageSourcePropType, TouchableHighlight } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.View`
  display: flex;
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
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
}

export const MoreCard = ({ icon, title, onPress }: AssetCardProps) => {
  const theme = useTheme()
  return (
    <TouchableHighlight
      underlayColor={
        theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
      }
      style={{ flex: 1, minHeight: 90 }}
      onPress={onPress}
    >
      <Host>
        <Image source={icon} style={{ width: 24, height: 24 }} />
        <Title>{title}</Title>
      </Host>
    </TouchableHighlight>
  )
}
