import React from 'react'
import styled from 'styled-components/native'
import { Image, StyleProp, ViewStyle } from 'react-native'

import checkedIcon from '../../assets/icons/checkbox-checked.png'
import uncheckedIcon from '../../assets/icons/checkbox-unchecked.png'
import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.Pressable<{ borderBottom?: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-width: ${({ theme, borderBottom }) =>
    borderBottom ? theme.border.width.standard : 0}px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
`

interface CheckboxProps {
  containerStyle?: StyleProp<ViewStyle>
  borderBottom?: boolean
  label: string
  checked: boolean
  onPress: () => void
}

export const Checkbox = ({
  label,
  checked,
  onPress,
  containerStyle,
  borderBottom = true,
}: CheckboxProps) => {
  return (
    <Host
      borderBottom={borderBottom}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessible
      style={containerStyle}
    >
      <Typography
        style={{
          fontWeight: checked ? '600' : '300',
        }}
      >
        {label}
      </Typography>
      <Image source={checked ? checkedIcon : uncheckedIcon} />
    </Host>
  )
}
