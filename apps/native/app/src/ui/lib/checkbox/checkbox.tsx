import React from 'react'
import styled from 'styled-components/native'
import { Image } from 'react-native'

import checkedIcon from '../../assets/icons/checkbox-checked.png'
import uncheckedIcon from '../../assets/icons/checkbox-unchecked.png'
import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.Pressable`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade300,
    }),
    true,
  )};
`

interface CheckboxProps {
  label: string
  checked: boolean
  onPress: () => void
}

export const Checkbox = ({ label, checked, onPress }: CheckboxProps) => {
  return (
    <Host onPress={onPress} accessibilityRole="checkbox" accessible>
      <Typography style={{ fontWeight: checked ? '600' : '300' }}>
        {label}
      </Typography>
      <Image source={checked ? checkedIcon : uncheckedIcon} />
    </Host>
  )
}
