import React from 'react'
import styled from 'styled-components/native'

import tickIcon from '../../assets/icons/checkbox-tick.png'
import { dynamicColor, token } from '../../utils'
import { Typography } from '../typography/typography'

const Host = styled.Pressable<{
  borderBottom?: boolean
  isFullWidth?: boolean
}>`
  flex-direction: ${({ isFullWidth }) => (isFullWidth ? 'row' : 'row-reverse')};
  justify-content: ${({ isFullWidth }) =>
    isFullWidth ? 'space-between' : 'flex-end'};
  gap: ${({ theme }) => theme.spacing[1]}px;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-width: ${({ theme, borderBottom }) =>
    borderBottom ? theme.border.width.standard : 0}px;
  border-bottom-color: ${token((t) => t.border.primary)};
`

const Box = styled.View<{ isChecked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.border.radius.standard};
  border-width: ${({ theme, isChecked }) =>
    isChecked ? 0 : theme.border.width.standard}px;
  border-color: ${dynamicColor<{ isChecked: boolean }>(
    ({ theme, isChecked }) => ({
      light: isChecked
        ? theme.tokenModes.light.interactive.background.primary
        : theme.tokenModes.light.border.primary,
      dark: isChecked
        ? theme.tokenModes.dark.interactive.background.primary
        : theme.tokenModes.dark.border.primary,
    }),
  )};
  background-color: ${dynamicColor<{ isChecked: boolean }>(
    ({ theme, isChecked }) => ({
      light: isChecked
        ? theme.tokenModes.light.interactive.background.primary
        : theme.tokenModes.light.background.invert,
      dark: isChecked
        ? theme.tokenModes.dark.interactive.background.primary
        : theme.tokenModes.dark.background.invert,
    }),
  )};
`

const Tick = styled.Image`
  width: 24px;
  height: 24px;
  tint-color: ${token((t) => t.interactive.foreground.invert)};
`

interface CheckboxProps {
  borderBottom?: boolean
  label: React.ReactNode
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
      accessibilityState={{ checked }}
      accessible
      isFullWidth={isFullWidth}
    >
      <Typography
        style={{
          flexShrink: 1,
          fontWeight: checked ? '600' : '300',
        }}
      >
        {label}
      </Typography>
      <Box isChecked={checked}>{checked && <Tick source={tickIcon} />}</Box>
    </Host>
  )
}
