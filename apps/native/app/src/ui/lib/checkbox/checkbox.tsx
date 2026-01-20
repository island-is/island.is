import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'

import checkedIcon from '../../assets/icons/checkbox-checked.png'
import uncheckedIcon from '../../assets/icons/checkbox-unchecked.png'
import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.Pressable<{ borderBottom?: boolean, isFullWidth?: boolean }>`
  flex-direction: ${({ isFullWidth }) => isFullWidth ? 'row' : 'row-reverse'};
  justify-content: ${({ isFullWidth }) => isFullWidth ? 'space-between' : 'flex-end'};
  gap: ${({ theme }) => theme.spacing[1]}px;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
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
  borderBottom?: boolean
  label: string
  checked: boolean
  onPress: () => void
  isFullWidth?: boolean
}

export const Checkbox = ({
  label,
  checked,
  onPress,
  borderBottom = false,
  isFullWidth = false,
}: CheckboxProps) => {
  return (
    <Host
      borderBottom={borderBottom}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessible
      isFullWidth={isFullWidth}
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
