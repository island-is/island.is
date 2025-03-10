import React from 'react'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils'

const Host = styled.View`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => ({
      dark: theme.shades.dark.shade500,
      light: theme.color.blue200,
    }),
    true,
  )};
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
`

interface FieldGroupProps {
  children: React.ReactNode
}

export function FieldGroup({ children }: FieldGroupProps) {
  return <Host>{children}</Host>
}
