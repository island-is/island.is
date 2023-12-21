import React from 'react'
import { ViewProps } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'

const Host = styled.View<{ spacing: number }>`
  flex: 1;
  margin-top: ${({ spacing, theme }) =>
    theme.spacing[spacing as keyof typeof theme.spacing]}px;
  margin-bottom: ${({ spacing, theme }) =>
    theme.spacing[spacing as keyof typeof theme.spacing]}px;
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue100,
      dark: theme.shades.dark.shade200,
    }),
    true,
  )};
`

interface DividerProps extends ViewProps {
  spacing?: 0 | 1 | 2 | 3 | 4
}

export const Divider = ({ spacing = 1, ...rest }: DividerProps) => {
  return <Host spacing={spacing} {...rest} />
}
