import React from 'react'
import styled from 'styled-components/native'

const Host = styled.View`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  padding-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
  border-bottom-color: ${({ theme }) =>
    theme.isDark ? theme.shade.shade500 : theme.color.blue200};
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
`

interface FieldGroupProps {
  children: React.ReactNode
}

export function FieldGroup({ children }: FieldGroupProps) {
  return <Host>{children}</Host>
}
