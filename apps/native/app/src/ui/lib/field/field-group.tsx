import React from 'react'
import styled from 'styled-components/native'
import { token } from '../../utils'

const Host = styled.View`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  border-bottom-color: ${token((t) => t.border.primary)};
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
`

interface FieldGroupProps {
  children: React.ReactNode
}

export function FieldGroup({ children }: FieldGroupProps) {
  return <Host>{children}</Host>
}
